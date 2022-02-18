const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const userTokens = sequelize.define('user_tokens', {
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
		// The timestamp is added automatically by Sequelize
		// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#timestamps
	});

	return userTokens;
};
