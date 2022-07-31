module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define("categories", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return categories;
};
