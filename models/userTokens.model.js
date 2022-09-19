module.exports = (sequelize, DataTypes) => {
  const userTokens = sequelize.define(
    "user_tokens",
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return userTokens;
};
