module.exports = (sequelize, DataTypes) => {
	const user_rust_infos = sequelize.define(
		'user_rust_infos',
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
			roles: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
				allowNull: false,
			},
			play_styles: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				defaultValue: [],
				allowNull: false,
			},
			is_published: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return user_rust_infos;
};
