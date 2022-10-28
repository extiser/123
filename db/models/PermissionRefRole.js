import { DataTypes, Model } from 'sequelize';

import db from '../db';

class PermissionRefRole extends Model {}

const model = PermissionRefRole.init({
  role_id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true
  },
  permission_id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true
  },
}, {
  sequelize: db,
  tableName: 'permissions_ref_roles',
});

export default model;