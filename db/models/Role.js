import { DataTypes, Model } from 'sequelize';
import db from '../db';

class Role extends Model {}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  access_level: {
    type: DataTypes.BIGINT(20),
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.BIGINT(20).UNSIGNED, 
    allowNull: true
  },
}, {
  sequelize: db,
  tableName: 'roles',
});

export default Role;