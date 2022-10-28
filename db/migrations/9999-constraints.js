export async function up(queryInterface, { DataTypes, Sequelize }) {
  // created_by one-to-one
  await queryInterface.addConstraint('users', {
    fields: ['created_by'],
    type: 'foreign key',
    name: 'users_created_by',
    references: { table: 'users', field: 'id' },
    onDelete: 'set null',
    onUpdate: 'restrict'
  });
  // role_id one-to-one
  await queryInterface.addConstraint('users', {
    fields: ['role_id'],
    type: 'foreign key',
    name: 'users_role_id',
    references: { table: 'roles', field: 'id' },
    onDelete: 'set null',
    onUpdate: 'restrict'
  });
  // status_id one-to-one
  await queryInterface.addConstraint('users', {
    fields: ['status_id'],
    type: 'foreign key',
    name: 'users_status_id',
    references: { table: 'statuses', field: 'id' },
    onDelete: 'set null',
    onUpdate: 'restrict'
  });
  // referral_id one-to-many
  await queryInterface.addConstraint('referrals_ref_users', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'referrals_ref_users_users',
    references: { table: 'users', field: 'id' },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  await queryInterface.addConstraint('referrals_ref_users', {
    fields: ['referral_id'],
    type: 'foreign key',
    name: 'referrals_ref_users_referrals',
    references: { table: 'users', field: 'id' },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  // created_by one-to-one
  await queryInterface.addConstraint('roles', {
    fields: ['created_by'],
    type: 'foreign key',
    name: 'roles_created_by',
    references: { table: 'users', field: 'id' },
    onDelete: 'set null',
    onUpdate: 'restrict'
  });
  // created_by one-to-one
  await queryInterface.addConstraint('permissions', {
    fields: ['created_by'],
    type: 'foreign key',
    name: 'permissions_created_by',
    references: { table: 'users', field: 'id' },
    onDelete: 'set null',
    onUpdate: 'restrict'
  });
  // role_id one-to-many
  await queryInterface.addConstraint('permissions_ref_roles', {
    fields: ['role_id'],
    type: 'foreign key',
    name: 'permissions_ref_roles_roles',
    references: { table: 'roles', field: 'id' },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  await queryInterface.addConstraint('permissions_ref_roles', {
    fields: ['permission_id'],
    type: 'foreign key',
    name: 'permissions_ref_roles_permissions',
    references: { table: 'permissions', field: 'id' },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
}

export async function down(queryInterface) {
  await queryInterface.removeConstraint('users', 'users_created_by');
  await queryInterface.removeConstraint('users', 'users_role_id');
  await queryInterface.removeConstraint('users', 'users_status_id');
  await queryInterface.removeConstraint('referrals_ref_users', 'referrals_ref_users_users');
  await queryInterface.removeConstraint('referrals_ref_users', 'referrals_ref_users_referrals');
  await queryInterface.removeConstraint('roles', 'roles_created_by');
  await queryInterface.removeConstraint('permissions', 'permissions_created_by');
  await queryInterface.removeConstraint('permissions_ref_roles', 'permissions_ref_roles_roles');
  await queryInterface.removeConstraint('permissions_ref_roles', 'permissions_ref_roles_permissions');
}