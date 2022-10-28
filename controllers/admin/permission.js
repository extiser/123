import { User, Permission } from '../../db/models';
import { getTokenData } from '../../utils';
import { apiError, apiSuccess } from '../../utils/apiResponse';

export const create = async(req, res) => {
  const user_id = getTokenData(req).id;
  const { name, title } = req.body;

  if (!name) return apiError(res, 400, `Name is required`, { error: true, field: 'name' });
  if (!title) return apiError(res, 400, `Title is required`, { error: true, field: 'title' });

  try {
    const [permission, created] = await Permission.findOrCreate({
      where: { name },
      defaults: {
        name,
        title,
        created_by: user_id
      }
    });

    if (!created) return apiError(res, 409, `Permission '${name}' already exists`, { error: true, field: 'name' });

    return apiSuccess(res, 200, `Permission '${name}' successfully created`, { created });

  } catch(err) {
    apiError(res, 500);
  }
}

export const get = async(req, res) => {
  const user_id = getTokenData(req).id;
  const id = req.params.id;

  try {
    let permissions;

    if (id) {
      permissions = await Permission.findOne({ where: { id, created_by: user_id } });
      return apiSuccess(res, 200, `Permission item`, { permissions });
    }

    permissions = await Permission.findAll({
      where: { created_by: user_id },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username'],
      }],
      nest: true,
      raw: true
    });
    return apiSuccess(res, 200, `List of permissions`, { permissions });

  } catch(err) {
    apiError(res, 500);
  }
}

export const update = async(req, res) => {
  const data = req.body;
  const id = req.params.id;

  if (!id) return apiError(res, 400, `Permission ID is reguired`);
  if (!data.name && !data.title) return apiError(res, 400, `Request body is empty`, { error: true, field: ['title', 'id'] });
  
  try {
    const permission = await Permission.findOne({ raw: false, where: { id } });

    if (!permission) return apiError(res, 404, `Permission with id '${id}' is not found`);

    if (data.name) permission.name = data.name;
    if (data.title) permission.title = data.title;

    await permission.save();

    return apiSuccess(res, 200, `Permission with id '${id}' successfully updated`, { permission });

  } catch(err) {
    if (err) {
      if (err.errors[0].validatorKey === 'not_unique') return apiError(res, 409, `Permission with name '${data.name}' already exists`);

      apiError(res, 500);
    }
  }
}

export const remove = async(req, res) => {
  const user_id = getTokenData(req).id;
  const id = req.params.id;

  if (!id) return apiError(res, 400, `Permission ID is reguired`, { error: true, field: 'id' });

  try {
    const permission = await Permission.findOne({ where: { id, created_by: user_id } });

    if (permission && permission.name === 'grant_all') return apiError(res, 403, `You can't delete this permission. Access denied!`);

    const deleted = await Permission.destroy({ where: { id } });

    if (!deleted) return apiError(res, 404, `Permission with id '${id}' is not found`);

    return apiSuccess(res, 200, `Permission with id '${id}' successfully deleted`);

  } catch(err) {
    apiError(res, 500);
  }
}