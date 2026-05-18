import { Request, Response } from 'express';
import { readTickets, writeTickets } from '../utils/ticketDb';
import { db } from '../config/db';
import { help } from '../db/schema';
import { sql, or, eq } from 'drizzle-orm';

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
