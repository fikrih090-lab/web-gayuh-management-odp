import { Request, Response } from 'express';
import { NetworkService } from '../services/network.service';

export const getOdps = async (req: Request, res: Response) => {
    try {
        const page   = Math.max(1, parseInt(req.query.page as string)  || 1);
        const limit  = parseInt(req.query.limit as string) || 50;
        const search = ((req.query.search as string) || '').toLowerCase().trim();

        const all = await NetworkService.getAllOdps();

        const filtered = search
            ? all.filter(o =>
                (o.codeOdp  || '').toLowerCase().includes(search) ||
                (o.noPole   || '').toLowerCase().includes(search) ||
                (o.remark   || '').toLowerCase().includes(search)
              )
            : all;

        const total = filtered.length;
        const data  = filtered.slice((page - 1) * limit, page * limit);

        res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
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
