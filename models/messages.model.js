// 'use strict';
const { sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define(
    "messages",
    {
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return messages;
};
