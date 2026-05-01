import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';

async function run() {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash('admin', salt);
    console.log('New hash:', hash);
    
    // Verifikasi
    const check = await bcryptjs.compare('admin', hash);
    console.log('Verification:', check);
    
    // Update users.json
    const dataFile = path.join('src', 'data', 'users.json');
    const users = [
        {
            id: 1,
            email: 'admin',
            name: 'Super Admin',
            password: hash,
            phone: '08123456789',
            roleId: '1'
        }
    ];
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    console.log('users.json updated!');
    process.exit(0);
}

run();
