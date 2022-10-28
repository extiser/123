import fs from 'fs';
import path from 'path';
import sequelize, { DataTypes } from 'sequelize';
import Migration from './models/_Migration';
import db from './db';
import moment from 'moment';

const logger = console;
const migrationsPath = path.join(__dirname, 'migrations');

async function runMigrations() {
  try {
    const queryInterface = db.getQueryInterface();
    queryInterface.createTable('_migrations', {
      filename: DataTypes.STRING,
      appliedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('current_timestamp'),
        allowNull: false
      }
    });

    logger.debug(`Scan folder "${migrationsPath}" for migrations`, { scope: 'migrations' });

    const [list, migrations] = await Promise.all([
      readDir(migrationsPath),
      Migration.findAll()
    ]);

    for (const file of list) {
      if (!file.match(/\.js$/)) {
        continue;
      }
      const appliedMigration = migrations.find((migration) => migration.filename === file);

      if (appliedMigration) {
        logger.debug(`Migration "${file}" was applied ${moment(appliedMigration.appliedAt, 'YYYY-MM-DD H:i:s').fromNow()}`, { scope: 'migrations' });
        continue;
      }

      logger.debug(`Migration "${file}" applying...`, { scope: 'migrations' });

      const { up, down } = require(path.join(migrationsPath, file));

      if (!up || !down) {
        throw new Error(`Invalid migration functions in file ${file}`);
      }

      await up(queryInterface, sequelize);

      const item = new Migration({
        filename: file,
        appliedAt: Date.now()
      });
      await item.save();

      logger.debug(`Migration "${file}" successfully applied`, { scope: 'migrations' });
      continue;
    }

    function readDir(dir) {
      return new Promise((resolve, reject) => {
        fs.readdir(dir, (errDir, files) => {
          if (errDir) {
            return reject(errDir);
          }
          return resolve(files);
        });
      });
    }
  } catch(err) {
    console.log(err);
  }
}

runMigrations();