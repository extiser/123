import { DataTypes, Model } from 'sequelize';

import db from '../db';

class ReferralRefUser extends Model {}

const model = ReferralRefUser.init({
  user_id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true
  },
  referral_id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    primaryKey: true
  },
}, {
  sequelize: db,
  tableName: 'referrals_ref_users',
});

export default model;