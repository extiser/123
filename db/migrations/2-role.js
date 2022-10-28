export async function up(queryInterface, { DataTypes, Sequelize }) {
  await queryInterface.createTable('roles', {
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
      allowNull: false
    },
    access_level: {
      type: DataTypes.BIGINT(20),
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.BIGINT(20).UNSIGNED,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('current_timestamp')
    },
    deleted_at: {
      type: DataTypes.DATE
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('roles');
}