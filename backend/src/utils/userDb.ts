import fs from 'fs';
import path from 'path';

const dataFile = path.join(__dirname, '..', 'data', 'users.json');

// Pastikan folder data ada
if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
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
