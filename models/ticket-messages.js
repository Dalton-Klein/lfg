// 'use strict';

module.exports = (sequelize, DataTypes) => {
  const ticket_messages = sequelize.define(
    "ticket_messages",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(750),
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return ticket_messages;
};
