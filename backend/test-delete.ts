import { ClientService } from './src/services/client.service';
import { db } from './src/config/db';

async function run() {
    try {
        await ClientService.deleteClient('1_gayuh_1234');
        console.log('Success');
    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
