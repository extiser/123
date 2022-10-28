import express from 'express';
import methodNotAllowed from '../default';
import { login } from '../../controllers/admin/auth';
const router = express.Router();

router.route('/login')
  .post(login)
  .all(methodNotAllowed);

export default router;