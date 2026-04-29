import { Router } from 'express';
import { login, resetAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/reset-admin', resetAdmin);

export default router;
