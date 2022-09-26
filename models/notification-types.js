module.exports = (sequelize, DataTypes) => {
	const notification_types = sequelize.define(
		'notification_types',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(30),
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return notification_types;
};
