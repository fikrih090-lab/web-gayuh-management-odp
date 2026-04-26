import { Router } from 'express';
import { getInvoices, generateInvoices, payInvoice, getStats } from '../controllers/finance.controller';

const router = Router();

router.get('/invoices', getInvoices);
router.post('/invoices/generate', generateInvoices);
router.post('/invoices/:id/pay', payInvoice);
router.get('/stats', getStats);

export default router;
