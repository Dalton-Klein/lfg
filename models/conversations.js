module.exports = (sequelize, DataTypes) => {
  const conversations = sequelize.define(
    "conversations",
    {
      users: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), //user ids
        allowNull: false,
      },
    },
    { schema: "gangs", freezeTableName: true }
  );

  return conversations;
};
