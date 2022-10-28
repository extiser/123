import User from './User';
import Role from './Role';
import Status from './Status';
import Permission from './Permission';
import PermissionRefRole from './PermissionRefRole';
import ReferralRefUser from './ReferralRefUser';

User.belongsTo(User, { as: 'owner', foreignKey: 'created_by' });
User.belongsToMany(User, { as: 'referral', through: ReferralRefUser, foreignKey: 'user_id', otherKey: 'referral_id' });
User.belongsTo(Role, { as: 'role', foreignKey: 'role_id' });
User.belongsTo(Status, { as: 'status', foreignKey: 'status_id' });

Role.belongsTo(User, { as: 'owner', foreignKey: 'created_by' });
Role.belongsToMany(Permission, { as: 'permissions', through: PermissionRefRole, foreignKey: 'role_id', otherKey: 'permission_id' });

Permission.belongsTo(User, { as: 'owner', foreignKey: 'created_by' });

export {
  User,
  Role,
  Status,
  Permission
}