module.exports = (sequelize, DataTypes) => {
	const notifications = sequelize.define(
		'notifications',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			owner_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			other_user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return notifications;
};
