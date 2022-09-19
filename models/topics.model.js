module.exports = (sequelize, DataTypes) => {
  const topics = sequelize.define(
    "topics",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );
  return topics;
};
