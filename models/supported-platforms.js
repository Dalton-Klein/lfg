module.exports = (sequelize, DataTypes) => {
  const supported_platforms = sequelize.define("supported_platforms", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return supported_platforms;
};
