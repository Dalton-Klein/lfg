module.exports = (sequelize, DataTypes) => {
	const endorsements = sequelize.define(
		'endorsements',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			receiver_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			sender_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			is_positive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);
	return endorsements;
};
