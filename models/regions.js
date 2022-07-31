module.exports = (sequelize, DataTypes) => {
  const regions = sequelize.define("regions", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return regions;
};
