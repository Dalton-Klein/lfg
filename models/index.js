require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
const PORT = process.env.DB_PORT;
const DBNAME = process.env.DB_TITLE;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
let sequelize;
const devConfig = {
	database: DBNAME,
	username: USER,
	password: PASSWORD,
	host: HOST,
	port: PORT,
	dialect: 'postgres',
};
const prodConfig = {
	database: DBNAME,
	username: USER,
	password: PASSWORD,
	host: HOST,
	port: PORT,
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
};
if (process.env.IS_PROD == '0') {
	sequelize = new Sequelize(devConfig);
} else {
	sequelize = new Sequelize(process.env.DATABASE_URL, prodConfig);
}
const db = {};
fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
