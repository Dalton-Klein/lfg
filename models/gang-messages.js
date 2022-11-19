// 'use strict';

module.exports = (sequelize, DataTypes) => {
	const gang_messages = sequelize.define(
		'gang_messages',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			chat_id: {
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

	return gang_messages;
};
