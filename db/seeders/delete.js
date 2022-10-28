import db, { openConnection, closeConnection } from '../db';

import User from '../models/User';
import Status from '../models/Status';
import Role from '../models/Role';
import Permission from '../models/Permission';

const logger = console;

const saltRounds = 10;
const defaultPassword = '123456';
const secretKey = 'some_secret_key';

const start = async() => {
  try {
    await openConnection();

    await db.transaction(async () => {
      await User.destroy({ where: { username: 'root' } });
      logger.info(`Default Root user successfully deleted!`);

      await Status.destroy({ where: {} });
      logger.info(`Default Statuses successfully deleted!`);
      
      await Role.destroy({ where: {} });
      logger.info(`Default Roles successfully deleted!`);

      await Permission.destroy({ where: {} });
      logger.info(`Permissions successfully deleted!`);
    });

    await closeConnection();
  } catch(err) {
    logger.debug({
      sqlMessage: err.parent.sqlMessage ? err.parent.sqlMessage : undefined,
      sql: err.parent.sql ? err.parent.sql : undefined,
      message: 'Seed not aplied',
    });
  }
}

start();
