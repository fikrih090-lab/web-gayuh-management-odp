import { Request, Response } from 'express';
import { NetworkService } from '../services/network.service';

export const getOdps = async (req: Request, res: Response) => {
    try {
        const result = await NetworkService.getAllOdps();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODPs' });
    }
};

export const getOdpById = async (req: Request, res: Response) => {
    try {
        const odp = await NetworkService.getOdpById(Number(req.params.id));
        if (!odp) return res.status(404).json({ error: 'ODP not found' });
        res.json(odp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODP' });
    }
};

export const createOdp = async (req: Request, res: Response) => {
    try {
        const odp = await NetworkService.createOdp(req.body);
        res.status(201).json(odp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ODP' });
    }
};

export const getOdcs = async (req: Request, res: Response) => {
    try {
        const result = await NetworkService.getAllOdcs();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ODCs' });
    }
};
