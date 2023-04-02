module.exports = (sequelize, DataTypes) => {
	const gang_roles = sequelize.define(
		'gang_roles',
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

	return gang_roles;
};
