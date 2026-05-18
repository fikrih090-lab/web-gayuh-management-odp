import { Router } from 'express';
import { getTickets, createTicket, updateTicket, deleteTicket, getDbTicketStats, getDbResolvedTickets } from '../controllers/ticket.controller';

const router = Router();

router.get('/db-stats', getDbTicketStats);
router.get('/db-resolved', getDbResolvedTickets);
router.get('/', getTickets);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
