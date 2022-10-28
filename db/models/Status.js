import { DataTypes, Model } from 'sequelize';
import db from '../db';

class Status extends Model {}

Status.init({
  id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  comment: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  sequelize: db,
  tableName: 'statuses',
});

export default Status;