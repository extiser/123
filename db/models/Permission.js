import { DataTypes, Model } from 'sequelize';
import db from '../db';

import User from './User';

class Permission extends Model {}

Permission.init({
  id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  created_by: {
    type: DataTypes.BIGINT(20).UNSIGNED, 
  },
}, {
  sequelize: db,
  tableName: 'permissions',
});

export default Permission;