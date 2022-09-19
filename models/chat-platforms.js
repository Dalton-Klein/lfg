module.exports = (sequelize, DataTypes) => {
  const chat_platforms = sequelize.define(
    "chat_platforms",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "gangs", freezeTableName: true }
  );
  return chat_platforms;
};
