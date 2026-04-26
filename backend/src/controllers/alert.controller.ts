import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';

export const getActiveAlerts = async (req: Request, res: Response) => {
    try {
        const result = await AlertService.getActiveAlerts();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

export const resolveAlert = async (req: Request, res: Response) => {
    try {
        await AlertService.resolveAlert(Number(req.params.id));
        res.json({ message: 'Alert marked as resolved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve alert' });
    }
};
