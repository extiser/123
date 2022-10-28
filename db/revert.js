import fs from 'fs';
import path from 'path';
import sequelize from 'sequelize';
import Migration from './models/_Migration';
import db from './db';

const logger = console;
const migrationsPath = path.join(__dirname, 'migrations');

async function revertMigration() {
  try {
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

    const [list, migration] = await Promise.all([
      readDir(migrationsPath),
      Migration.findAll()
    ]);

    list.reverse();

    for (const file of list) {
      if (!file.match(/\.js$/)) {
        continue;
      }
      const migrationFile = path.join(migrationsPath, file);

      logger.debug(`Reverting "${file}"...`, { scope: 'migrations' });

      const migration = await Migration.findOne({
        where: { filename: file }
      });

      if (!migration) {
        logger.debug(`Migration "${file}" not applied`, { scope: 'migrations' });
        continue;
      }

      await Migration.destroy({ where: { filename: file } });

      const { up, down } = require(migrationFile);

      if (!up || !down) {
        throw new Error(`Invalid migration functions in file ${migrationFile}`);
      }
      await down(db.getQueryInterface(), sequelize);

      logger.debug(`Migration "${file}" successfully reverted`, { scope: 'migrations' });
    }
  } catch(err) {
    console.log(err);
  }
}

revertMigration();