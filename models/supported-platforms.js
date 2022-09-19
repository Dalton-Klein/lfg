module.exports = (sequelize, DataTypes) => {
  const supported_platforms = sequelize.define(
    "supported_platforms",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "gangs", freezeTableName: true }
  );
  return supported_platforms;
};
