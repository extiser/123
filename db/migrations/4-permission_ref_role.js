export async function up(queryInterface, { DataTypes }) {
  await queryInterface.createTable('permissions_ref_roles', {
    role_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true
    },
    permission_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('permissions_ref_roles');
}