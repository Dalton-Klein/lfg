module.exports = (sequelize, DataTypes) => {
  const chat_platforms = sequelize.define("chat_platforms", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return chat_platforms;
};
