module.exports = (sequelize, DataTypes) => {
	const posts = sequelize.define('posts', {
		owner: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		photo_url: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '',
		},
		number_votes: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: true,
		},
	});

	return posts;
};
