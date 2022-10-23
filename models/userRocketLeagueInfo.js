module.exports = (sequelize, DataTypes) => {
	const user_rocket_league_infos = sequelize.define(
		'user_rocket_league_infos',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			hours: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			preferred_playlist: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			rank: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			weekdays: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			weekends: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			is_published: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return user_rocket_league_infos;
};
