import express from 'express';
import methodNotAllowed from '../default';
import { checkToken, checkAccessRights } from '../../middleware';
import { get, create, update, remove, assignStatus } from '../../controllers/admin/status';
const router = express.Router();

router.route('/statuses')
  .get(checkToken, checkAccessRights, get)
  .post(checkToken, checkAccessRights, create)
  .all(methodNotAllowed);

// get by id
router.route('/statuses/:id')
  .get(checkToken, checkAccessRights, get)
  // .put(checkToken, checkAccessRights, assignStatus)
  // .patch(checkToken, checkAccessRights, update)
  // .delete(checkToken, checkAccessRights, remove)
  .all(methodNotAllowed);

  export default router;