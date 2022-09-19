module.exports = (sequelize, DataTypes) => {
	const user_general_infos = sequelize.define(
		'user_general_infos',
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
			about: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			age: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			gender: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			region: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			languages: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			preferred_platform: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			discord: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			psn: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			xbox: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			last_seen: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.NOW,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return user_general_infos;
};
