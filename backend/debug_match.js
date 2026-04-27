const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugMatch() {
  const c = await mysql.createConnection({ uri: process.env.DATABASE_URL.replace(/\/[^/]*$/, '/') });
  
  console.log('--- 5 PELANGGAN TERBARU ---');
  const [clients] = await c.query(`
    SELECT c.name, c.id_odp, o.code_odp 
    FROM gayuh.customer c 
    LEFT JOIN gayuh.m_odp o ON c.id_odp = o.id_odp 
    WHERE c.id_odp != 0 LIMIT 5
  `);
  clients.forEach(cl => {
    console.log(`Pelanggan: ${cl.name} | ID ODP: ${cl.id_odp} | Code ODP: [${cl.code_odp}]`);
  });

  console.log('\n--- 5 ODP TERBARU ---');
  const [odps] = await c.query(`SELECT id_odp, code_odp FROM gayuh.m_odp LIMIT 5`);
  odps.forEach(o => {
    console.log(`ID ODP: ${o.id_odp} | Code ODP: [${o.code_odp}]`);
  });
  
  await c.end();
}
debugMatch().catch(e => console.error(e.message));
