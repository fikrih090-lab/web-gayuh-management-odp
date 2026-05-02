import { Router } from 'express';
import { getOdps, getOdpById, createOdp, getOdcs, deleteOdp, updateOdp, importOdps } from '../controllers/network.controller';

const router = Router();

router.post('/odps/import', importOdps);
router.get('/odps', getOdps);
router.get('/odps/:id', getOdpById);
router.post('/odps', createOdp);
router.put('/odps/:id', updateOdp);
router.delete('/odps/:id', deleteOdp);
router.get('/odcs', getOdcs);

export default router;
