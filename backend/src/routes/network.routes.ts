import { Router } from 'express';
import { getOdps, getOdpById, createOdp, getOdcs, deleteOdp, updateOdp } from '../controllers/network.controller';

const router = Router();

router.get('/odps', getOdps);
router.get('/odps/:id', getOdpById);
router.post('/odps', createOdp);
router.put('/odps/:id', updateOdp);
router.delete('/odps/:id', deleteOdp);
router.get('/odcs', getOdcs);

export default router;
