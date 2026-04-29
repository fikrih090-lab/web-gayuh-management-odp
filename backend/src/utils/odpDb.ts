import fs from 'fs';
import path from 'path';

// Gunakan process.cwd() agar path benar di semua environment (Windows & Linux/pm2)
const dataFile = path.resolve(process.cwd(), 'src', 'data', 'odp_overrides.json');
const dataDir = path.resolve(process.cwd(), 'src', 'data');

// Pastikan folder dan file ada, dengan error handling agar tidak crash
try {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
    }
} catch (e) {
    console.warn('[ODP Overrides] Could not initialize override file (non-fatal):', e);
}

export const readOdpOverrides = (): Record<string, any> => {
    try {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

export const writeOdpOverrides = (data: Record<string, any>) => {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (e) {
        console.warn('[ODP Overrides] Could not write override file:', e);
    }
};
