module.exports = (sequelize, DataTypes) => {
	const gang_chats = sequelize.define(
		'gang_chats',
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
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			privacy_level: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return gang_chats;
};
