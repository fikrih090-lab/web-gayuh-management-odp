import fs from 'fs';
import path from 'path';

// Gunakan process.cwd() agar path benar di semua environment (Windows & Linux/tsx)
// exec cwd pm2 = /var/www/.../backend, jadi ini resolve ke backend/src/data/users.json
const dataFile = path.resolve(process.cwd(), 'src', 'data', 'users.json');

// Pastikan folder data ada
const dataDir = path.resolve(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Inisialisasi file json jika belum ada
if (!fs.existsSync(dataFile)) {
    // Default admin user (admin/admin)
    // password "admin" hash bcrypt
    const defaultUsers = [
        {
            id: 1,
            email: 'admin',
            name: 'Super Admin',
            password: '$2b$10$vj5aCm2Xqh8IlxF.VBkG0OBfOjydUu44VW0X7ki5HGKkvsRFq1ytO',
            phone: '08123456789',
            roleId: '1'
        }
    ];
    fs.writeFileSync(dataFile, JSON.stringify(defaultUsers, null, 2));
}

export const readUsers = () => {
    try {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const writeUsers = (users: any[]) => {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
};
