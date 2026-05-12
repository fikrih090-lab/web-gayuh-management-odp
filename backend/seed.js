const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function readJsonSafe(filePath) {
  let raw16 = fs.readFileSync(filePath, 'utf16le');
  if (raw16.charCodeAt(0) === 0xFEFF) {
    raw16 = raw16.slice(1);
  }
  return JSON.parse(raw16);
}

async function seed() {
  const url = process.env.DATABASE_URL;
  const parsed = new URL(url);
  const host = parsed.hostname;
  const port = Number(parsed.port) || 3306;
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const database = parsed.pathname.replace('/', '');

  const conn = await mysql.createConnection({ host, port, user, password, database });
  console.log('Connected to DB:', database);

  try {
    // 1. Seed ODPs
    const odpsRaw = readJsonSafe(path.join(__dirname, '../temp_odps.json'));
    const odps = Array.isArray(odpsRaw) ? odpsRaw : (odpsRaw.data || []);
    
    let odpCount = 0;
    for (const o of odps) {
      try {
        await conn.execute(
          `INSERT IGNORE INTO m_odp (code_odp, code_odc, coverage_odp, no_port_odc, color_tube_fo, no_pole, latitude, longitude, total_port, document, remark, created, create_by, role_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            o.codeOdp || 'UNKNOWN',
            o.codeOdc || 1,
            o.coverageOdp || 1,
            o.noPortOdc || 1,
            o.colorTubeFo || '-',
            o.noPole || '-',
            o.latitude || '0',
            o.longitude || '0',
            o.totalPort || 8,
            o.document || '-',
            o.remark || '-',
            o.created || Math.floor(Date.now()/1000),
            o.createBy || 1,
            o.roleId || 1
          ]
        );
        odpCount++;
      } catch (e) {
        console.error('Failed to insert ODP:', o.codeOdp, e.message);
      }
    }
    console.log(`✅ Seeded ${odpCount} ODPs`);

    // 2. Seed Clients (customers)
    const clientsRaw = readJsonSafe(path.join(__dirname, '../temp_test.json'));
    const clients = Array.isArray(clientsRaw) ? clientsRaw : (clientsRaw.data || []);
    
    // Wait, earlier we saw temp_test.json has the exact same structure as temp_odps.json
    // Let's insert a dummy customer to be safe if temp_test is broken
    await conn.execute(
        `INSERT IGNORE INTO customer (name, no_services, email, register_date, due_date, address, no_wa, c_status, ppn, no_ktp, ktp, created, mode_user, user_mikrotik, mitra, coverage, auto_isolir, type_id, router, codeunique, phonecode, latitude, longitude, user_profile, action, type_payment, max_due_isolir, olt, connection, cust_amount, mac_address, level, cust_description, type_ip, id_odc, id_odp, no_port_odp, month_due_date, send_bill, serial_number, pass_mikrotik, slot, port, onu_index, onu_type, vlan, no_va, up_onu, down_onu, customer_mitra, createby)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            'Fikrih', 'Standard', '-', '2026-05-12', 1, 'Jl Raya', '08123456789', 'Aktif', 0, '-', '-', Math.floor(Date.now()/1000), 'pppoe', '-', 1, 1, 1, 'Standard', 1, 0, 62, '0', '0', 'default', 1, 1, 0, 1, 1, 150000, '-', 1, '-', 1, 1, 1, 1, 0, 1, '-', '-', 1, 1, 1, '-', 0, '-', '-', '-', 1, 1
        ]
    );
    console.log(`✅ Seeded 1 dummy client (Fikrih)`);

  } catch (e) {
    console.error('Seeding error:', e);
  } finally {
    await conn.end();
  }
}

seed();
