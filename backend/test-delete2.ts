import { initMultiDb } from './src/config/db';
import { ClientService } from './src/services/client.service';

async function run() {
    try {
        await initMultiDb();
        await ClientService.deleteClient('1_gayuh_1234');
        console.log('Success');
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
