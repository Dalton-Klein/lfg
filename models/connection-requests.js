module.exports = (sequelize, DataTypes) => {
  const connection_requests = sequelize.define("connection_requests", {
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
  });

  return connection_requests;
};
