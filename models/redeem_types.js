module.exports = (sequelize, DataTypes) => {
  const redeem_types = sequelize.define(
    "redeem_types",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      max_redeems: {
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

  return redeem_types;
};
