const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSpecificOdp() {
  const targetDbs = [
    { host: '103.151.34.20', id: 'default' },
    { host: '103.151.34.21', id: '2' },
    { host: '103.151.35.18', id: '3' }
  ];
  
  const targetOdp = 'PON 4 - HIOSO E';
  console.log(`Mencari pelanggan untuk ODP: [${targetOdp}]...\n`);

  for (const h of targetDbs) {
    const uri = (h.id === 'default') ? process.env.DATABASE_URL.replace(/\/[^/]*$/, '/') : process.env[`DATABASE_URL_${h.id}`];
    try {
      const c = await mysql.createConnection({ uri });
      const [dbs] = await c.query('SHOW DATABASES');
      for (const dbRow of dbs) {
        const db = dbRow.Database;
        if (['information_schema','mysql','performance_schema','sys','phpmyadmin'].includes(db)) continue;
        
        try {
          // Cari ODP-nya dulu untuk dapat ID-nya
          const [odps] = await c.query(`SELECT id_odp, code_odp FROM \`${db}\`.m_odp WHERE code_odp LIKE ?`, [`%${targetOdp}%`]);
          
          for (const o of odps) {
            const [clients] = await c.query(`SELECT name, no_port_odp FROM \`${db}\`.customer WHERE id_odp = ?`, [o.id_odp]);
            if (clients.length > 0) {
              console.log(`[Host ${h.host}] DB: ${db} -> ODP Found: [${o.code_odp}] (ID: ${o.id_odp})`);
              clients.forEach(cl => console.log(`   - Pelanggan: ${cl.name} (Port: ${cl.no_port_odp})`));
            }
          }
        } catch(e) {}
      }
      await c.end();
    } catch(e) { console.error(`Gagal konek ke ${h.host}: ${e.message}`); }
  }
}
checkSpecificOdp();
