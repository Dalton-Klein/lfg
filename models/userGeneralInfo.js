module.exports = (sequelize, DataTypes) => {
	const user_general_infos = sequelize.define('user_general_infos', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		about: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		gender: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		region: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		languages: {
			type: DataTypes.STRING,
		},
		preferred_platform: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		discord: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		psn: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		xbox: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		last_seen: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.NOW,
		},
	});

	return user_general_infos;
};
