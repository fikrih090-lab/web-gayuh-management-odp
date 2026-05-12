const mysql = require('mysql2/promise');
require('dotenv').config();

const url = process.env.DATABASE_URL;
// Gunakan URL parser bawaan Node untuk handle special chars di password
const parsed = new URL(url);

const host = parsed.hostname;
const port = Number(parsed.port) || 3306;
const user = decodeURIComponent(parsed.username);
const password = decodeURIComponent(parsed.password);
const dbName = parsed.pathname.replace('/', '');

console.log(`Connecting to ${host}:${port} as ${user} → create DB: ${dbName}`);

(async () => {
  const conn = await mysql.createConnection({ host, port, user, password });
  try {
    await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' berhasil dibuat (atau sudah ada)`);
  } catch (e) {
    console.error('❌ Gagal buat database:', e.message);
  } finally {
    await conn.end();
  }
})();
