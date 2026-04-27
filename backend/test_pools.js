const mysql = require('mysql2/promise');
require('dotenv').config();

const excluded = ['information_schema','mysql','performance_schema','phpmyadmin','sys'];

async function testPool(hostId, uri) {
  console.log(`\n=== Testing pool for ${hostId} ===`);
  console.log('URI:', uri.replace(/:([^@]+)@/, ':***@'));
  
  const pool = mysql.createPool({ uri });
  
  try {
    const [dbs] = await pool.query('SHOW DATABASES');
    const dbNames = dbs.map(d => d.Database).filter(d => !excluded.includes(d));
    console.log('Databases found:', dbNames.length);
    
    // Test query ke salah satu db
    const testDb = dbNames[0];
    if (testDb) {
      const [rows] = await pool.query(`SELECT COUNT(*) as n FROM \`${testDb}\`.customer`);
      console.log(`Query to ${testDb}.customer:`, rows[0].n, 'rows');
    }
    
    console.log('✅ Pool OK');
  } catch(e) {
    console.error('❌ Pool Error:', e.message);
  }
  
  await pool.end();
}

async function main() {
  const urls = {
    'default': process.env.DATABASE_URL,
    '2':       process.env.DATABASE_URL_2,
    '3':       process.env.DATABASE_URL_3,
  };
  
  for (const [id, uri] of Object.entries(urls)) {
    if (uri) await testPool(id, uri);
  }
}

main().catch(e => console.error('Fatal:', e.message));
