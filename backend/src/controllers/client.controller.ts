import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const result = await ClientService.getAllClients();
        res.json(result);
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
        await ClientService.deleteClient(Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' });
    }
};
