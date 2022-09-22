// 'use strict';
const { sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const messages = sequelize.define(
		'messages',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			connection_id: {
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
		},
		{ schema: 'public', freezeTableName: true }
	);

	return messages;
};
