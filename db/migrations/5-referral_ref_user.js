export async function up(queryInterface, { DataTypes, Sequelize }) {
  await queryInterface.createTable('referrals_ref_users', {
    user_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true
    },
    referral_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('referrals_ref_users');
}