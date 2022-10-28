import express from 'express';
import methodNotAllowed from '../default';
import { checkToken, checkAccessRights } from '../../middleware';
import { get, create, update, remove, assignPermission } from '../../controllers/admin/role';
const router = express.Router();

router.route('/roles')
  .get(checkToken, checkAccessRights, get)
  .post(checkToken, checkAccessRights, create)
  .all(methodNotAllowed);

// get by id
router.route('/roles/:id')
  .get(checkToken, checkAccessRights, get)
  .put(checkToken, checkAccessRights, assignPermission)
  .patch(checkToken, checkAccessRights, update)
  .delete(checkToken, checkAccessRights, remove)
  .all(methodNotAllowed);

export default router;