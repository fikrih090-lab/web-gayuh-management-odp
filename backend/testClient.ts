import { ClientService } from './src/services/client.service';

ClientService.createClient({
    name: 'Budi Santoso',
    noWa: '0812345678',
    address: 'Jl. Merdeka No 45',
    latitude: '-6.91',
    longitude: '107.61',
    typeId: 'Standard',
    custAmount: 150000,
    idOdp: 495,
    noPortOdp: 1
}).then(console.log).catch(console.error);
