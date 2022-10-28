import _ from 'lodash';
import { Op } from 'sequelize';
import { User, Role, Permission } from '../../db/models';
import { getTokenData, normalize } from '../../utils';
import { apiError, apiSuccess } from '../../utils/apiResponse';

export const get = async(req, res) => {
  const id = req.params.id;
  const user_id = getTokenData(req).id;

  try {
    let user = await User.findOne({
      where: { id: user_id },
      attributes: ['id'],
      include: [{
        model: Role,
        as: 'role',
      }],
      raw: true,
      nest: true,
    });

    let roles;

    if (id) {
      roles = await Role.findAll({
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username'],
          },
          {
            model: Permission,
            as: 'permissions',
            attributes: ['id', 'name', 'title'],
            through: {
              attributes: []
            }
          }
        ],
        where: {
          id,
          access_level: {
            [Op.lt]: user.role.access_level
          }
        },
        attributes: ['id', 'name', 'title'],
        nest: true,
        raw: true,
      });

      roles = await normalize(roles, 'permissions');

      return apiSuccess(res, 200, 'Success', { roles });
    }

    roles = await Role.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username'],
        },
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'title'],
          through: {
            attributes: []
          }
        }
      ],
      where: { 
        access_level: {
          [Op.lt]: user.role.access_level
        }
      },
      attributes: ['id', 'name', 'title'],
      nest: true,
      raw: true,
    });

    roles = await normalize(roles, 'permissions');

    return apiSuccess(res, 200, 'Success', { roles });

  } catch(err) {
    apiError(res, 500);
  }
}

export const create = async(req, res) => {
  const user_id = getTokenData(req).id;

  const { name, title } = req.body;

  if (!name) return apiError(res, 400, `Name is required`, { error: true, field: 'name' });
  if (!title) return apiError(res, 400, `Title is required`, { error: true, field: 'title' });

  try {
    const [role, created] = await Role.findOrCreate({
      where: { name },
      defaults: {
        name,
        title,
        created_by: user_id
      }
    });

    if (!created) return apiError(res, 409, `Role '${name}' already exists`, { error: true, field: 'name' });

    return apiSuccess(res, 200, `Role '${name}' successfully created`);
  } catch(err) {
    apiError(res, 500);
  }
}

export const remove = async(req, res) => {
  const id = req.params.id;

  if (!id) return apiError(res, 400, `Role ID is reguired`, { error: true, field: 'id' });

  try {
    const role = await Role.findOne({ where: { id } });

    if (role && role.name === 'root') return apiError(res, 403, `You can't delete this permission. Access denied!`);

    const deleted = await Role.destroy({ where: { id } });

    if (!deleted) return apiError(res, 404, `Role with id '${id}' is not found`);

    return apiSuccess(res, 200, `Role with id '${id}' successfully deleted`);

  } catch(err) {
    apiError(res, 500);
  }
}

export const assignPermission = async(req, res) => {
  const user_id = getTokenData(req).id;
  const permissions_ids = req.body.permissions;
  const id = req.params.id;

  if (!id) return apiError(res, 400, `Role ID is reguired`, { error: true, field: 'id' });
  if (!permissions_ids || permissions_ids.length === 0 || typeof permissions_ids !== 'object') return apiError(res, 400, `Permission ID is reguired or wrong array of permissions`, { error: true, field: 'permissions' });

  try {
    const role = await Role.findOne({ 
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id'],
          through: {
            attributes: []
          }
        }
      ],
      where: { id, created_by: user_id }, raw: false 
    });

    const permissions = await Permission.findAll({
      where: { 
        id: { 
          [Op.in]: permissions_ids 
        },
        created_by: user_id
      },
      raw: false
    });

    if (!role) return apiError(res, 404, `Role with id '${id}' is not found`);
    if (!permissions || permissions.length === 0) return apiError(res, 404, `Permissions with id '${permissions_ids}' is not found`);

    for (let permission of role.permissions) {
      await role.removePermission(permission);
    }

    for (let permission of permissions) {
      await role.addPermission(permission);
    }

    let updated = await Role.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username'],
        }, 
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'title'],
          through: {
            attributes: []
          }
        }
      ],
      where: { id, created_by: user_id },
      attributes: ['id', 'name', 'title'],
      nest: true,
      raw: true,
    });

    updated = await normalize(updated, 'permissions');

    return apiSuccess(res, 200, `Permissions successfully added`, { updated });

  } catch(err) {
    apiError(res, 500);
  }
}

export const update = async(req, res) => {
  const data = req.body;
  const id = req.params.id;

  if (!id) return apiError(res, 400, `Role ID is reguired`, { error: true, field: 'id' });
  if (!data.name && !data.title) return apiError(res, 400, `Request body is empty`, { error: true, field: ['title', 'id'] });
  
  try {
    const role = await Role.findOne({ raw: false, where: { id } });

    if (!role) return apiError(res, 404, `Role with id '${id}' is not found`);

    if (data.name) role.name = data.name;
    if (data.title) role.title = data.title;

    await role.save();

    return apiSuccess(res, 200, `Role with id '${id}' successfully updated`, { role });

  } catch(err) {
    if (err) {
      if (err.errors[0].validatorKey === 'not_unique') return apiError(res, 409, `Role with name '${data.name}' already exists`);

      apiError(res, 500);
    }
  }
}