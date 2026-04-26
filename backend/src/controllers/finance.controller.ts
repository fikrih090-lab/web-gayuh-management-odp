import { Request, Response } from 'express';
import { FinanceService } from '../services/finance.service';

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const result = await FinanceService.getAllInvoices();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

export const generateInvoices = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.body;
        const count = await FinanceService.generateMonthlyInvoices(month, year);
        res.json({ message: `Generated ${count} invoices successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate invoices' });
    }
};

export const payInvoice = async (req: Request, res: Response) => {
    try {
        await FinanceService.payInvoice(Number(req.params.id));
        res.json({ message: 'Invoice marked as paid' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to pay invoice' });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await FinanceService.getFinanceStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
