import { db } from './src/config/db';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        const res = await db.execute(sql`DESCRIBE m_odp`);
        console.log(res);
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
