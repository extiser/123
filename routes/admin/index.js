import express from 'express';
import authRoutes from './auth';
import permissionRoutes from './permission';
import roleRoutes from './role';
import userRoutes from './user';
import statusRoutes from './status';
const router = express.Router();

router.use('/', authRoutes);
router.use('/', statusRoutes);
router.use('/', permissionRoutes);
router.use('/', roleRoutes);
router.use('/', userRoutes);

export default router;