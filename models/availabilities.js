module.exports = (sequelize, DataTypes) => {
  const availabilities = sequelize.define(
    "availabilities",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { schema: "gangs", freezeTableName: true }
  );
  return availabilities;
};
