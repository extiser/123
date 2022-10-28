export async function up(queryInterface, { DataTypes, Sequelize }) {
  await queryInterface.createTable('statuses', {
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
      unique: true,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
  await queryInterface.dropTable('statuses');
}