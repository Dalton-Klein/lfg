module.exports = (sequelize, DataTypes) => {
	const supported_platforms = sequelize.define(
		'supported_platforms',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);
	return supported_platforms;
};
