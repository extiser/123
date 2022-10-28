export async function up(queryInterface, { DataTypes, Sequelize }) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING, 
      allowNull: true,
      defaultValue: null,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tg_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    role_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
    },
    status_id: {
      type: DataTypes.BIGINT(20).UNSIGNED,
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
  await queryInterface.dropTable('users');
}