import { User } from '../../db/models';

import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../env.config';
import { apiError, apiSuccess } from '../../utils/apiResponse';

export const login = async(req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !validator.isAlphanumeric(username, ['en-US'], {'ignore': '.'})) 
      return apiError(res, 400, 'The username field can only contain letters of the Latin alphabet, numbers and a dot.', { error: true, field: 'username' });
    
    if (!password || validator.isEmpty(password))
      return apiError(res, 400, 'The password field can not be empty.', { error: true, field: 'password' });
      
    const user = await User.findOne({ where: { username } });

    if (!user) 
      return apiError(res, 404, `The user with username '${username}' is not found`);

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match)
      return apiError(res, 403, `Wrong password for username '${username}'`,  { error: true, field: 'password' });

    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username, 
      }, 
      config.JWT_SECRET, 
      {
        expiresIn: config.JWT_EXPIRED
      }
    );

    const updated = await User.update(
      {
        token,
        updated_at: Date.now()
      },
      { where: { id: user.id } 
    });

    if (!updated) 
      return apiError(res, 500);

    user.token = token;

    apiSuccess(res, 200, 'Success', { token: user.token });

  } catch(err) {
    apiError(res, 500);
  }
}

// Register is closed
// export const register = async(req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !validator.isAlphanumeric(username, ['en-US'], {'ignore': '.'})) 
//       return apiError(res, 400, 'The Username field can only contain letters of the Latin alphabet, numbers and a dot.');
    
//     if (!password || validator.isEmpty(password) || !validator.isLength(password, { min: 6 }))
//       return apiError(res, 400, 'The Password field can not be empty and less then 6 symbols');
      
//     const [user, created] = await User.findOrCreate({
//       where: { username },
//       defaults: {
//         username,
//         password
//       }
//     });

//     if (!created) 
//       return apiError(res, 404, `The user with username '${username}' already exists, try to Login`);
    
    


//   } catch(err) {

//   }
//   // if (!validator.isStrongPassword(password))
//   // apiError(res, 400, 'The password field must contain: Uppercase letters, Small letters, Numbers, Special characters');
// }