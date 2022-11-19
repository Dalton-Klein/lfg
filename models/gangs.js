module.exports = (sequelize, DataTypes) => {
	const gangs = sequelize.define(
		'gangs',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			about: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
			},
			avatar_url: {
				type: DataTypes.STRING,
				defaultValue: '',
				allowNull: false,
			},
			chat_platform_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			game_platform_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			is_public: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			is_published: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
		},
		{ schema: 'public', freezeTableName: true }
	);

	return gangs;
};
