import fs from 'fs';
import path from 'path';

// Gunakan process.cwd() agar path benar di semua environment (Windows & Linux/pm2)
const dataFile = path.resolve(process.cwd(), 'src', 'data', 'odp_overrides.json');

// Pastikan folder data ada
const dataDir = path.resolve(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Inisialisasi file json jika belum ada
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}

export const readOdpOverrides = () => {
    try {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

export const writeOdpOverrides = (data: any) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};
