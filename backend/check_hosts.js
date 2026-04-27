const mysql = require('mysql2/promise');
const excluded = ['information_schema','mysql','performance_schema','phpmyadmin','sys'];

async function checkHost(id, uri) {
  console.log('\n=== HOST', id, '===');
  const c = await mysql.createConnection({ uri });
  const [dbs] = await c.query('SHOW DATABASES');
  const dbNames = dbs.map(d => d.Database).filter(d => !excluded.includes(d));
  console.log('Total databases:', dbNames.length);
  
  let totalClients = 0, totalOdps = 0;

  for (const db of dbNames) {
    try {
      const [tables] = await c.query(`SHOW TABLES FROM \`${db}\``);
      const tableNames = tables.map(t => Object.values(t)[0]);
      
      let clientCount = 0, odpCount = 0;
      if (tableNames.includes('customer')) {
        const [[r]] = await c.query(`SELECT COUNT(*) as n FROM \`${db}\`.customer`);
        clientCount = r.n;
        totalClients += clientCount;
      }
      if (tableNames.includes('m_odp')) {
        const [[r]] = await c.query(`SELECT COUNT(*) as n FROM \`${db}\`.m_odp`);
        odpCount = r.n;
        totalOdps += odpCount;
      }
      if (clientCount > 0 || odpCount > 0) {
        console.log(`  [${db}] customer: ${clientCount} | m_odp: ${odpCount}`);
      } else {
        console.log(`  [${db}] Tables: ${tableNames.join(', ') || '(kosong)'}`);
      }
    } catch(e) {
      console.log(`  [${db}] Error:`, e.message);
    }
  }
  console.log(`  => TOTAL clients: ${totalClients} | ODP: ${totalOdps}`);
  await c.end();
}

async function main() {
  await checkHost('.21', 'mysql://lunaai:Gayuh%402021!@103.151.34.21:3306/');
  await checkHost('.18', 'mysql://lunaai:Gayuh%402021!@103.151.35.18:3306/');
}
main().catch(e => console.error('Fatal:', e.message));
