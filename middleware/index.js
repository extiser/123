import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import decode from 'jwt-decode';
import config from '../env.config';
import { apiError } from '../utils/apiResponse';
import { Op } from 'sequelize';

import { User, Role, Permission } from '../db/models';

export const checkToken = async(req, res, next) => {
  if (!req.headers.authorization) 
    return apiError(res, 404, 'No token provided');

  const bearer = req.headers.authorization.split(' ')[0];

  if (!bearer) 
    return apiError(404, 'Bearer is required');

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, config.JWT_SECRET, async (err) => {
    if (err) 
      return apiError(res, 403, 'Access token is missing or invalid');

    try {
      const user = await User.findOne({ where: { token } });

      if (!user) 
        return apiError(res, 403, `Access token is missing or invalid`);
    
    } catch(err) {
      return apiError(res, 500);
    }

    await next();
  });
}

export const checkAccessRights = async(req, res, next) => {
  const decoded_token = decode(req.headers.authorization.split(' ')[1]);
  
  const route = req.route;
  const method = req.method;
  const path = route.path.split('/')[1];

  try {
    let users = await User.findAll({
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
        include: [{
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name'],
          where: {
            name: `${path}_${method.toLowerCase()}`
          },
          through: {
            attributes: []
          }
        }]
      }],
      where: { id: decoded_token.id },
      attributes: ['id'],
      raw: true,
      nest: true,
    });

    if (!users.length === 0) 
      return apiError(res, 404, 'User not found. Contact with administration!');

    const granted = users.find(user => user.role.permissions.name);

    if (!granted) return apiError(res, 403, 'Forbidden. Access denined!');

    await next();

  } catch(err) {
    console.log(err);
    return apiError(res, 500);
  }
}