import config from '../env.config.js';
import express from 'express';

const router = express.Router();

import adminRoutes from './admin';
import userRoutes from './user';
import partnerRoutes from './partner';

router.use(`${config.API_PREFIX}/admin`, adminRoutes);
router.use(`${config.API_PREFIX}/user`, userRoutes);
router.use(`${config.API_PREFIX}/partner`, partnerRoutes);

export default router;