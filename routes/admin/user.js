import express from 'express';
import methodNotAllowed from '../default';
import { checkToken, checkAccessRights } from '../../middleware';
import { get, create } from '../../controllers/admin/user';
const router = express.Router();

router.route('/users')
  .get(checkToken, checkAccessRights, get)
  .post(checkToken, checkAccessRights, create)
  .all(methodNotAllowed);

// // get by id
router.route('/users/:id')
  .get(checkToken, checkAccessRights, get)
//   .put(checkToken, checkAccessRights, assignPermission)
//   .patch(checkToken, checkAccessRights, update)
//   .delete(checkToken, checkAccessRights, remove)
//   .all(methodNotAllowed);

export default router;