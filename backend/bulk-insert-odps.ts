import { db } from './src/config/db';
import { mOdp } from './src/db/schema';
import { NetworkService } from './src/services/network.service';
import { eq } from 'drizzle-orm';

const odpCodes = [
    'AA2', 'AA3', 'AA4', 'AA5', 'AA6', 'AA7', 'AA8', 'AA9', 'AA10', 'AA11', 
    'AA12', 'AA13', 'AA14', 'AA15', 'AA16', 'AA3B', 'AA2 B', 'AA1 B'
];

async function run() {
    try {
        for (const code of odpCodes) {
            const existing = await db.select().from(mOdp).where(eq(mOdp.codeOdp, code));
            if (existing.length === 0) {
                console.log(`Inserting ${code}...`);
                await NetworkService.createOdp({
                    codeOdp: code,
                    latitude: '-6.9175',
                    longitude: '107.6191',
                    totalPort: 8
                });
            } else {
                console.log(`ODP ${code} already exists, skipping.`);
            }
        }
        console.log('Finished processing ODPs');
    } catch (e) {
        console.error('Error processing:', e);
    }
    process.exit(0);
}

run();
