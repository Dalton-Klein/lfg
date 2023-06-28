module.exports = (sequelize, DataTypes) => {
  const redeems = sequelize.define(
    "redeems",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      redeem_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return redeems;
};
