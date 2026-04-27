const mysql = require('mysql2/promise');
require('dotenv').config();

const excluded = ['information_schema','mysql','performance_schema','phpmyadmin','sys'];

async function checkOdpData(hostId, uri) {
  console.log(`\n=== HOST ${hostId} ===`);
  const c = await mysql.createConnection({ uri });
  const [dbs] = await c.query('SHOW DATABASES');
  const dbNames = dbs.map(d => d.Database).filter(d => !excluded.includes(d));
  
  for (const db of dbNames) {
    try {
      const [[cnt]] = await c.query(`SELECT COUNT(*) as n FROM \`${db}\`.m_odp`);
      if (cnt.n === 0) continue;
      
      // Sample 5 ODPs
      const [samples] = await c.query(`SELECT code_odp, total_port, remark, latitude, longitude FROM \`${db}\`.m_odp LIMIT 5`);
      const codes = samples.map(r => r.code_odp).join(', ');
      console.log(`  [${db}] Total: ${cnt.n} ODPs | Sample codes: ${codes}`);
    } catch(e) {}
  }
  await c.end();
}

async function main() {
  await checkOdpData('default (.20)', process.env.DATABASE_URL.replace(/\/[^/]*$/, '/'));
  await checkOdpData('host .21',     process.env.DATABASE_URL_2);
  await checkOdpData('host .18',     process.env.DATABASE_URL_3);
}
main().catch(e => console.error('Fatal:', e.message));
