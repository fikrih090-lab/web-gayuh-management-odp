const mysql = require('mysql2/promise');
require('dotenv').config();

const EXCLUDED = ['information_schema','mysql','performance_schema','phpmyadmin','sys'];

async function debugSync() {
  const hosts = [
    { id: 'default', uri: process.env.DATABASE_URL.replace(/\/[^/]*$/, '/') },
    { id: '2',       uri: process.env.DATABASE_URL_2 },
    { id: '3',       uri: process.env.DATABASE_URL_3 },
  ];

  let totalClients = 0, totalOdp = 0;
  const odpCodeSet = new Map(); // code_odp -> { total_port, client_count }

  for (const h of hosts) {
    const c = await mysql.createConnection({ uri: h.uri });
    const [dbs] = await c.query('SHOW DATABASES');
    const dbNames = dbs.map(r => r.Database).filter(d => !EXCLUDED.includes(d));

    for (const db of dbNames) {
      try {
        // Count clients
        const [[cl]] = await c.query(`SELECT COUNT(*) as n FROM \`${db}\`.customer`);
        totalClients += cl.n;

        // Count ODPs
        const [[od]] = await c.query(`SELECT COUNT(*) as n FROM \`${db}\`.m_odp`);

        // Aggregate ODP port usage
        const [rows] = await c.query(`
          SELECT o.code_odp, o.total_port, COUNT(c.customer_id) as used
          FROM \`${db}\`.m_odp o
          LEFT JOIN \`${db}\`.customer c ON c.id_odp = o.id_odp
          GROUP BY o.id_odp
        `);

        for (const row of rows) {
          const key = (row.code_odp || '').toUpperCase().trim();
          if (!odpCodeSet.has(key)) {
            odpCodeSet.set(key, { totalPort: row.total_port, usedPorts: 0, sources: [] });
          }
          const e = odpCodeSet.get(key);
          e.usedPorts += Number(row.used || 0);
          e.sources.push(`${h.id}:${db}`);
        }
      } catch(e) {}
    }
    await c.end();
  }

  // Stats
  const validOdps = [...odpCodeSet.entries()].filter(([k,v]) => v.usedPorts > 0 || !['', '0'].includes(k));
  const totalUsed = validOdps.reduce((sum, [,v]) => sum + v.usedPorts, 0);
  const totalPorts = validOdps.reduce((sum, [,v]) => sum + (v.totalPort || 8), 0);
  const uniqueOdp = odpCodeSet.size;

  console.log(`\n========== RINGKASAN SINKRONISASI ==========`);
  console.log(`Total klien di semua DB     : ${totalClients}`);
  console.log(`Total ODP unik (code_odp)   : ${uniqueOdp}`);
  console.log(`Total port dari ODP         : ${totalPorts}`);
  console.log(`Total port terpakai (klien) : ${totalUsed}`);
  console.log(`\n-- 10 ODP dengan pelanggan terbanyak --`);
  [...odpCodeSet.entries()]
    .filter(([,v]) => v.usedPorts > 0)
    .sort((a,b) => b[1].usedPorts - a[1].usedPorts)
    .slice(0, 10)
    .forEach(([k,v]) => {
      console.log(`  ODP [${k}] => Port: ${v.totalPort}, Pelanggan: ${v.usedPorts}`);
    });

  console.log(`\n-- Sample: ODP dengan klien tapi code_odp berbeda casing --`);
  let sampleCount = 0;
  for (const [k, v] of odpCodeSet) {
    if (k !== k.toUpperCase() && v.usedPorts > 0) {
      console.log(`  Casing mismatch: [${k}] vs [${k.toUpperCase()}]`);
      if (++sampleCount >= 5) break;
    }
  }
  if (sampleCount === 0) console.log('  Tidak ada casing mismatch.');
}

debugSync().catch(e => console.error('FATAL:', e.message));
