import { Router } from 'express';
import { getOdps, getOdpById, createOdp, getOdcs } from '../controllers/network.controller';

const router = Router();

router.get('/odps', getOdps);
router.get('/odps/:id', getOdpById);
router.post('/odps', createOdp);
router.get('/odcs', getOdcs);

export default router;
