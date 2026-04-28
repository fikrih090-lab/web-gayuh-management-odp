import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page as string)  || 1);
        const limit = parseInt(req.query.limit as string) || 50;
        const search = ((req.query.search as string) || '').toLowerCase().trim();

        const all = await ClientService.getAllClients();

        // Filter di backend
        const filtered = search
            ? all.filter(c =>
                (c.name  || '').toLowerCase().includes(search) ||
                (c.noServices || '').toLowerCase().includes(search) ||
                (c.address || '').toLowerCase().includes(search) ||
                (c.idOdp  || '').toString().toLowerCase().includes(search)
              )
            : all;

        const total = filtered.length;
        const data  = filtered.slice((page - 1) * limit, page * limit);

        res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await ClientService.getClientById(Number(req.params.id));
        if (!client) return res.status(404).json({ error: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch client' });
    }
};

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await ClientService.createClient(req.body);
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create client' });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const client = await ClientService.updateClient(Number(req.params.id), req.body);
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update client' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        await ClientService.deleteClient(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' });
    }
};

export const getOdpCodes = async (req: Request, res: Response) => {
    try {
        const codes = await ClientService.getOdpCodesFromCustomers();
        res.json(codes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODP codes' });
    }
};
