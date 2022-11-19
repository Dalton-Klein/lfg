module.exports = (sequelize, DataTypes) => {
	const gang_privacy_levels = sequelize.define(
		'gang_privacy_levels',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			description: {
				type: DataTypes.STRING(40),
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return gang_privacy_levels;
};
