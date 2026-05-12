const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    await conn.query('SELECT 1');
    console.log('✅ Connected successfully to DB using DATABASE_URL!');
    process.exit(0);
  } catch(e) {
    console.error('❌ Error connecting to DB:', e);
    process.exit(1);
  }
}
test();
