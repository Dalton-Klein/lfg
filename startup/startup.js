'use strinct';
console.log('Startup script running... ');
const { sequelize } = require('../models');
const { Umzug, SequelizeStorage } = require('umzug');

const deploySeeders = async () => {
	const seeder = new Umzug({
		migrations: {
			glob: ['../db-scripts/seeders/*.js', { cwd: __dirname }],
		},
		context: sequelize,
		storage: new SequelizeStorage({
			sequelize,
			schema: 'public',
			modelName: 'sequelize_data',
		}),
		logger: console,
	});
	await seeder.up();
};

const deployMigrations = async () => {
	const seeder = new Umzug({
		migrations: {
			glob: ['../db-scripts/migrations/*.js', { cwd: __dirname }],
		},
		context: sequelize,
		storage: new SequelizeStorage({
			sequelize,
			schema: 'public',
			modelName: 'sequelize_meta',
		}),
		logger: console,
	});
	await seeder.up();
};

const main = async () => {
	try {
		await deploySeeders();
		// await deployMigrations();
	} catch (error) {
		throw `${error}`;
	}
};

module.exports = {
	main,
};
