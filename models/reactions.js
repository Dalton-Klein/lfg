module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define(
    "reactions",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      scope_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return notifications;
};
