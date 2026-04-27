const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      uri: 'mysql://lunaai:Gayuh%402021!@103.151.34.21:3306/'
    });
    console.log("SUCCESS: Berhasil terhubung ke 103.151.34.21!");
    const [rows] = await conn.query("SHOW DATABASES");
    console.log("Databases yang tersedia:", rows.map(r => r.Database).join(", "));
    await conn.end();
  } catch (e) {
    console.error("FAILED: Gagal terhubung.", e.message);
  }
}

testConnection();
