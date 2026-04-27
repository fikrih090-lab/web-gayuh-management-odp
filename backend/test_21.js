const mysql = require('mysql2/promise');
async function test() {
  const c = await mysql.createConnection({ uri: 'mysql://lunaai:Gayuh%402021!@103.151.34.21:3306/' });
  
  // Test 1: simple count
  const [[r1]] = await c.query(`SELECT COUNT(*) as n FROM \`bill2-gyh\`.customer`);
  console.log('bill2-gyh customer count:', r1.n);
  
  // Test 2: m_odp count
  const [[r2]] = await c.query(`SELECT COUNT(*) as n FROM \`bill2-gyh\`.m_odp`);
  console.log('bill2-gyh m_odp count:', r2.n);

  // Test 3: same query as backend
  const [rows] = await c.query(`
    SELECT o.*, COUNT(c.customer_id) AS used_ports
    FROM \`bill2-gyh\`.m_odp o
    LEFT JOIN \`bill2-gyh\`.customer c ON c.id_odp = o.id_odp
    GROUP BY o.id_odp
    LIMIT 3
  `);
  console.log('ODP query result:', rows.length, 'rows');
  if (rows.length > 0) console.log('Sample:', rows[0].code_odp, '| usedPorts:', rows[0].used_ports);
  
  await c.end();
}
test().catch(e => console.error('Error:', e.message));
