import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: '103.151.34.20',
  user: 'lunaai',
  password: 'Gayuh@2021!',
  database: 'gayuh'
});

async function run() {
  const [rows] = await pool.query('SELECT id, email, password, role_id, name FROM user LIMIT 5');
  console.log(rows);
  process.exit(0);
}
run();
