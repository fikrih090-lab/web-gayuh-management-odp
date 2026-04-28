import { db } from './src/config/db';
import { mOdp } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
    try {
        const rows = await db.select().from(mOdp);
        const aaCodes = rows.filter(r => r.codeOdp.startsWith('AA'));
        console.log(`Found ${aaCodes.length} ODPs starting with AA`);
        console.log(aaCodes.map(r => r.codeOdp));
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

run();
