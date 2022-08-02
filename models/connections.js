module.exports = (sequelize, DataTypes) => {
  const connections = sequelize.define("connections", {
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceptor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return connections;
};
