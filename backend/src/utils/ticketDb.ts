import fs from 'fs';
import path from 'path';

const dataFile = path.resolve(process.cwd(), 'src', 'data', 'tickets.json');

const dataDir = path.resolve(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    const defaultTickets = [
        {
            id: 1777427905001,
            title: 'Kabel Dropcore Putus tertabrak truk',
            description: 'Kabel dropcore ke pelanggan Pak Budi putus akibat ada truk muatan tinggi melintas di tiang ODP G01.',
            category: 'Kabel',
            status: 'Open',
            clientName: 'Budi Santoso',
            clientId: 'G-29381',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Helpdesk Gayuh',
            assignedTo: ''
        },
        {
            id: 1777427905002,
            title: 'LOS Merah / Red di Modem',
            description: 'Lampu LOS merah berkedip di modem pelanggan Ibu Siti. Sudah coba restart modem tetap sama.',
            category: 'Koneksi',
            status: 'In Progress',
            clientName: 'Siti Rahma',
            clientId: 'G-10293',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Helpdesk Gayuh',
            assignedTo: 'Teknisi Hendrik'
        }
    ];
    fs.writeFileSync(dataFile, JSON.stringify(defaultTickets, null, 2));
}

export const readTickets = () => {
    try {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const writeTickets = (tickets: any[]) => {
    fs.writeFileSync(dataFile, JSON.stringify(tickets, null, 2));
};
