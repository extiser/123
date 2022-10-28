export async function up(queryInterface, { DataTypes, Sequelize }) {
  await queryInterface.createTable('permissions', {
    id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.BIGINT(20).UNSIGNED,
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('permissions');
}