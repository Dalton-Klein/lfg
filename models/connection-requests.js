module.exports = (sequelize, DataTypes) => {
  const connection_requests = sequelize.define(
    "connection_requests",
    {
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      platform: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return connection_requests;
};
