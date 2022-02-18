module.exports = (sequelize, DataTypes) => {
	const vKeys = sequelize.define('v_keys', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		vkey: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
	return vKeys;
};
