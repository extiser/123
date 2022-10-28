import config from '../env.config';
import { Sequelize } from 'sequelize';

const db = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    dialect: 'mysql',
    logging: parseInt(config.DB_LOG, true) ? console.log : false,
    host: config.DB_HOST,
    port: config.DB_PORT,
    timezone: config.DB_TIMEZONE,
    define: {
      timestamps: false
    },
    query: {
      raw: true
    }
  }
);

export default db;

export function openConnection() {
  return db.authenticate();
}

export function closeConnection() {
  return db.close();
}