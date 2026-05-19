import { Request, Response } from 'express';
import { readTickets, writeTickets } from '../utils/ticketDb';
import { db } from '../config/db';
import { help, customer, helpType as helpTypeTable } from '../db/schema';
import { sql, or, eq, ne, like, inArray } from 'drizzle-orm';

export const getDbTicketStats = async (req: Request, res: Response) => {
    try {
        const rows = await db.select({
            status: help.status,
            count: sql<number>`count(*)`
        }).from(help).groupBy(help.status);
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching DB ticket stats:', error);
        res.status(500).json({ error: 'Gagal mengambil statistik tiket dari database' });
    }
};

export const getDbResolvedTickets = async (req: Request, res: Response) => {
    try {
        const rows = await db.select()
            .from(help)
            .where(eq(help.status, 'close'));
            
        res.json(rows);
    } catch (error) {
        console.error('Error fetching DB resolved tickets:', error);
        res.status(500).json({ error: 'Gagal mengambil data tiket selesai dari database' });
    }
};

// Helper: detect if text contains a maps URL
function extractMapsLink(text: string): string | null {
    if (!text) return null;
    // Match Google Maps URLs, goo.gl links, or coordinate patterns
    const mapsPatterns = [
        /https?:\/\/(www\.)?google\.com\/maps[^\s]*/i,
        /https?:\/\/maps\.google\.com[^\s]*/i,
        /https?:\/\/goo\.gl\/maps[^\s]*/i,
        /https?:\/\/maps\.app\.goo\.gl[^\s]*/i,
        /https?:\/\/waze\.com[^\s]*/i,
    ];
    for (const pattern of mapsPatterns) {
        const match = text.match(pattern);
        if (match) return match[0];
    }
    return null;
}

export const getDbPendingTickets = async (req: Request, res: Response) => {
    try {
        // Fetch tickets from DB where status is open/pending
        const rows = await db.select({
            id: help.id,
            noTicket: help.noTicket,
            helpType: help.helpType,
            description: help.description,
            status: help.status,
            teknisi: help.teknisi,
            noServices: help.noServices,
            dateCreated: help.dateCreated,
            picture: help.picture,
        })
        .from(help)
        .where(
            or(
                eq(help.status, 'open'),
                eq(help.status, 'pending'),
                eq(help.status, 'process')
            )
        );

        // Get customer info for each noServices
        const noServicesList = [...new Set(rows.map(r => r.noServices).filter(Boolean))];
        let customerMap: Record<string, any> = {};
        
        if (noServicesList.length > 0) {
            const customers = await db.select({
                noServices: customer.noServices,
                name: customer.name,
                address: customer.address,
                latitude: customer.latitude,
                longitude: customer.longitude,
            })
            .from(customer)
            .where(inArray(customer.noServices, noServicesList));
            
            for (const c of customers) {
                customerMap[c.noServices] = c;
            }
        }

        // Get helpType names
        const helpTypeIds = [...new Set(rows.map(r => r.helpType).filter(Boolean))];
        let helpTypeMap: Record<number, string> = {};
        
        if (helpTypeIds.length > 0) {
            const types = await db.select({
                helpId: helpTypeTable.helpId,
                helpType: helpTypeTable.helpType,
            })
            .from(helpTypeTable)
            .where(inArray(helpTypeTable.helpId, helpTypeIds));
            
            for (const t of types) {
                helpTypeMap[t.helpId] = t.helpType;
            }
        }

        // Map to frontend ticket format
        const tickets = rows.map(row => {
            const cust = customerMap[row.noServices] || {};
            const desc = row.description || '';
            const mapsLink = extractMapsLink(desc);
            
            // Build shareloc: prefer maps link from description, then from customer coordinates
            let shareloc = '';
            if (mapsLink) {
                shareloc = mapsLink;
            } else if (cust.latitude && cust.longitude && cust.latitude !== '0' && cust.longitude !== '0' && cust.latitude !== '' && cust.longitude !== '') {
                shareloc = `https://www.google.com/maps?q=${cust.latitude},${cust.longitude}`;
            }

            // Clean description: remove maps link if extracted
            let cleanDesc = desc;
            if (mapsLink) {
                cleanDesc = desc.replace(mapsLink, '').trim();
            }

            // Determine status mapping
            let mappedStatus = 'Open';
            if (row.status === 'process') mappedStatus = 'In Progress';

            // Category from helpType
            const category = helpTypeMap[row.helpType] || 'Lainnya';

            return {
                dbId: row.id,
                noTicket: row.noTicket,
                title: `[DB] ${row.noTicket || 'Tiket #' + row.id}`,
                description: cleanDesc || `Pelanggan: ${cust.name || row.noServices}`,
                category: category,
                status: mappedStatus,
                clientName: cust.name || row.noServices || '-',
                clientId: row.noServices || '-',
                createdAt: row.dateCreated ? new Date(row.dateCreated * 1000).toISOString() : new Date().toISOString(),
                shareloc: shareloc,
                assignedTo: '',
                notes: '',
                address: cust.address || '',
            };
        });

        res.json(tickets);
    } catch (error) {
        console.error('Error fetching DB pending tickets:', error);
        res.status(500).json({ error: 'Gagal mengambil tiket pending dari database' });
    }
};

export const getTickets = async (req: Request, res: Response) => {
    try {
        const tickets = readTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data tiket' });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { title, description, category, clientName, clientId, createdBy, shareloc, assignedTo, notes } = req.body;
        
        if (!title || !description || !category) {
            return res.status(400).json({ error: 'Judul, deskripsi, dan kategori wajib diisi' });
        }

        const tickets = readTickets();
        const newTicket = {
            id: Date.now(),
            title,
            description,
            category,
            status: 'Open',
            clientName: clientName || '-',
            clientId: clientId || '-',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: createdBy || 'Helpdesk',
            shareloc: shareloc || '',
            assignedTo: assignedTo || '',
            notes: notes || ''
        };

        tickets.unshift(newTicket); // Tambahkan ke paling atas
        writeTickets(tickets);

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: 'Gagal membuat tiket baru' });
    }
};

export const updateTicket = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, description, category, status, clientName, clientId, assignedTo, shareloc, notes } = req.body;

        const tickets = readTickets();
        const ticketIndex = tickets.findIndex((t: any) => t.id === id);

        if (ticketIndex === -1) {
            return res.status(404).json({ error: 'Tiket tidak ditemukan' });
        }

        const ticket = tickets[ticketIndex];
        const updatedTicket = {
            ...ticket,
            title: title !== undefined ? title : ticket.title,
            description: description !== undefined ? description : ticket.description,
            category: category !== undefined ? category : ticket.category,
            status: status !== undefined ? status : ticket.status,
            clientName: clientName !== undefined ? clientName : ticket.clientName,
            clientId: clientId !== undefined ? clientId : ticket.clientId,
            assignedTo: assignedTo !== undefined ? assignedTo : ticket.assignedTo,
            shareloc: shareloc !== undefined ? shareloc : ticket.shareloc,
            notes: notes !== undefined ? notes : (ticket.notes || ''),
            updatedAt: new Date().toISOString()
        };

        tickets[ticketIndex] = updatedTicket;
        writeTickets(tickets);

        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengupdate tiket' });
    }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const tickets = readTickets();
        const filtered = tickets.filter((t: any) => t.id !== id);
        
        if (tickets.length === filtered.length) {
            return res.status(404).json({ error: 'Tiket tidak ditemukan' });
        }

        writeTickets(filtered);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus tiket' });
    }
};
