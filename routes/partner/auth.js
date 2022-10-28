import express from 'express';
import methodNotAllowed from '../default';
import { login, register } from '../../controllers/partner/auth';
const router = express.Router();

router.route('/login')
  .post(login)
  .all(methodNotAllowed);

router.route('/register')
  .post(register)
  .all(methodNotAllowed);

export default router;