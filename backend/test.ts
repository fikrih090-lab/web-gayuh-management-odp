import { NetworkService } from './src/services/network.service';

NetworkService.createOdp({codeOdp: 'ODP-TEST-99', totalPort: 8, latitude: '-6.91', longitude: '107.61'}).then(console.log).catch(console.error);
