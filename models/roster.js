module.exports = (sequelize, DataTypes) => {
	const roster = sequelize.define(
		'roster',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			gang_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			role_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return roster;
};
