module.exports = (sequelize, DataTypes) => {
  const connections = sequelize.define(
    "connections",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      acceptor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      platform: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "gangs", freezeTableName: true }
  );

  return connections;
};
