import express from 'express';
import methodNotAllowed from '../default';
import { checkToken, checkAccessRights } from '../../middleware';
import { get, create, update, remove } from '../../controllers/admin/permission';
const router = express.Router();

router.route('/permissions')
  .get(checkToken, checkAccessRights, get)
  .post(checkToken, checkAccessRights, create)
  .all(methodNotAllowed);

router.route('/permissions/:id')
  .get(checkToken, checkAccessRights, get)
  .patch(checkToken, checkAccessRights, update)
  .delete(checkToken, checkAccessRights, remove)
  .all(methodNotAllowed);

export default router;