import { Op } from 'sequelize';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { Role, User, Status } from '../../db/models';
import { getTokenData, randomPassword } from '../../utils';
import config from '../../env.config';
import { apiError, apiSuccess } from '../../utils/apiResponse';

export const create = async(req, res) => {
  const user_id = getTokenData(req).id;

  const { username, role_id, phone } = req.body;

  if (!username || !validator.isAlphanumeric(username, ['en-US'], {'ignore': '._'})) 
    return apiError(res, 400, 'The username field can only contain letters of the Latin alphabet, numbers, . and _.');

  if (!role_id || !validator.isNumeric(role_id))
    return apiError(res, 400, 'The role_id field must be a number.');

  if (!phone || !validator.isMobilePhone(phone, 'any', { strictMode: true }))
    return apiError(res, 400, 'The phone field must be a valid phone number');

  try {
    const status = await Status.findOne({ where: { code: 1 }, raw: false });

    const [user, created] = await User.findOrCreate({
      where: { 
        [Op.or]: [
          { username },
          { phone }
        ]
      },
      defaults: {
        username,
        phone,
        role_id,
        created_by: user_id
      },
      raw: true
    });

    if (!created) {
      if (user.username === username)
        return apiError(res, 409, 'A user with this username already exists', { error: true, field: 'username' });
      
      if (user.phone === phone)
        return apiError(res, 409, 'A user with this phone number already exists', { error: true, field: 'phone' });
    }
    
    const password = randomPassword(20);
    const password_hash = bcrypt.hashSync(password, config.SALT_ROUNDS);

    user.password_hash = password_hash;
  
    await user.save();
    await user.setStatus(status);

    apiSuccess(res, 200, 'Success', { user: { username, password } });

  } catch(err) {
    apiError(res, 500);
  }
}

export const get = async(req, res) => {
  const id = Number(req.params.id);
  const root = getTokenData(req).username === 'root' ? true : false;
  const user_id = getTokenData(req).id;
  const page = req.body.page;
  const sort = req.body.sort ? req.body.sort : ['id', 'DESC'];
  const limit = 10;
  const offset = (page - 1) * limit;
  
  if (!id && (!page || !validator.isNumeric(page)))
    return apiError(res, 400, 'The page field must be a number.');
  
  if (typeof sort === 'string' || (typeof sort !== 'object' && sort.length < 2))
    return apiError(res, 400, 'The sort field must be an array of string. Example: ["id", "ASC"]. Remove it or fill correctly.');

  const options = {
    limit,
    offset,
    order: [
      sort
    ],
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'title'],
      },
      {
        model: Status,
        as: 'status',
        attributes: ['code', 'title', 'comment'],
      },
    ],
    raw: true,
    nest: true,
    attributes: ['id', 'username', 'phone', 'tg_id']
  };

  if (!root) {
    options.where = {
      created_by: user_id,
    };
  } else {
    options.include.push({
      model: User,
      as: 'owner',
      attributes: ['id', 'username']
    });
  }
  
  if (id) {
    options.where = {...options.where, id};
    options.limit = 1;
    options.offset = 0;
  }

  try {
    const total = await User.count(options);
    const pages = Math.ceil(total / limit);
    const users = await User.findAll(options);

    if (users.length === 0) {
      return apiSuccess(res, 404, 'Users not found', { users }) 
    }

    if (id) {
      return apiSuccess(res, 200, 'Success', { users }) 
    }

    apiSuccess(res, 200, 'Success', { users, total_users: total, current_page: Number(page), total_pages: pages })
  } catch(err) {
    apiError(res, 500);
  }
}