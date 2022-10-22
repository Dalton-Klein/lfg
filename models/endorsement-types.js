module.exports = (sequelize, DataTypes) => {
	const endorsements = sequelize.define(
		'endorsement_types',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			platform_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);
	return endorsements;
};
