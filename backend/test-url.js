import { createPool } from 'mysql2/promise';

const pool = createPool({
  uri: 'mysql://lunaai:Gayuh%402021!@103.151.34.20:3306/gayuh'
});

async function run() {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log("Success:", rows);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
run();
