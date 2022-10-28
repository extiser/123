import { User } from '../../db/models';

import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../env.config';
import { apiError, apiSuccess } from '../../utils/apiResponse';

export const auth = async(req, res) => {
  try {
    
  } catch(err) {
    apiError(res, 500);
  }
}