import { NetworkService } from './src/services/network.service';
import { initMultiDb } from './src/config/db';

async function run() {
    try {
        await initMultiDb();
        const odps = await NetworkService.getAllOdps();
        const aaOdps = odps.filter(o => o.codeOdp.startsWith('AA'));
        console.log(`Found ${aaOdps.length} AA ODPs from Service`);
        console.log(aaOdps.map(o => o.codeOdp));
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
