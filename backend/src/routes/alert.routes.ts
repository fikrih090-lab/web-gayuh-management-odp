import { Router } from 'express';
import { getActiveAlerts, resolveAlert } from '../controllers/alert.controller';

const router = Router();

router.get('/', getActiveAlerts);
router.patch('/:id/resolve', resolveAlert);

export default router;
