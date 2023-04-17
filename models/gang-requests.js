module.exports = (sequelize, DataTypes) => {
  const gang_requests = sequelize.define(
    "gang_requests",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_user_asking_to_join: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return gang_requests;
};
