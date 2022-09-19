module.exports = (sequelize, DataTypes) => {
  const supported_platforms = sequelize.define(
    "supported_platforms",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return supported_platforms;
};
