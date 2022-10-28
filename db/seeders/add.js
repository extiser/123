import config from '../../env.config';
import db, { openConnection, closeConnection } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, Role, Permission, Status } from '../models';

const logger = console;

const start = async() => {
  try {
    await openConnection();

    await db.transaction(async () => {
      const user = await User.create({
        username: 'root',
        phone: config.DEFAULT_ROOT_PHONE,
        tg_id: config.DEFAULT_ROOT_TG,
      });
      
      logger.info(`Default Root user successfully created!`);

      const listRoles = [
        { name: 'root', title: 'Root role', created_by: user.id, access_level: 7777 },
        { name: 'partner', title: 'Partner role', created_by: user.id, access_level: 0 },
        { name: 'driver', title: 'Driver role', created_by: user.id, access_level: 0 },
        { name: 'manager', title: 'Manager role', created_by: user.id, access_level: 0 },
        { name: 'support', title: 'Support role', created_by: user.id, access_level: 0 },
      ];

      const roles = await Role.bulkCreate(listRoles);

      logger.info(`Default Roles successfully added!`);

      await user.setRole(roles[0]);

      logger.info(`Root role successfully added to Root user!`);

      const listPermissions = [
        { name: 'grant_all', title: 'Grant All', created_by: user.id },
      ];

      const permissions = await Permission.bulkCreate(listPermissions);

      logger.info(`Default Permissions successfully added!`);

      for (let permission of permissions) {
        await roles[0].addPermission(permission);
      }

      logger.info(`Grant permission successfully added to Root role!`);

      const listStatuses = [
        { title: 'active', code: 1, title: 'Active account' },
        { title: 'await', code: 2, title: 'Awaiting moderation' },
        { title: 'banned', code: 3, title: 'Account banned' },
      ];

      const statuses = await Status.bulkCreate(listStatuses);

      logger.info(`Default Statuses successfully added!`);

      await user.setStatus(statuses[0]);

      logger.info(`Status '${statuses[0].title}' successfully set to Root user!`);

      const password_hash = bcrypt.hashSync(config.DEFAULT_ROOT_PASSWORD, config.SALT_ROUNDS);
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

      await User.update(
        {
          password_hash,
          token,
          created_by: user.id
        },
        { 
          where: { username: 'root' },
          returning: true,
          plain: true
        }
      );

      logger.info(`The default password is set to: ${config.DEFAULT_ROOT_PASSWORD}`);
      logger.info(`Token generated: ${token}`);
      logger.info(`The default phone is set to: ${config.DEFAULT_ROOT_PHONE}`);
      logger.info(`The default Telegram ID is set to: ${config.DEFAULT_ROOT_TG}`);
    });

    await closeConnection();
  } catch(err) {
    console.log(err);
    logger.debug({
      sqlMessage: err.parent.sqlMessage ? err.parent.sqlMessage : undefined,
      sql: err.parent.sql ? err.parent.sql : undefined,
      message: 'Seed not aplied',
    });
  }
}

start();
