import express from 'express';
import methodNotAllowed from '../default';
import { auth } from '../../controllers/user/auth';
const router = express.Router();

router.route('/auth')
  .post(auth)
  .all(methodNotAllowed);

export default router;