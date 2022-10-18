'use strinct';

const { endorsement_types } = require('../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.endorsement_types', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await endorsement_types.bulkCreate(
				[
					{
						id: 1,
						platform_id: 0,
						description: 'easy going',
						...defaultValues,
					},
					{
						id: 2,
						platform_id: 0,
						description: 'good attitude',
						...defaultValues,
					},
					{
						id: 3,
						platform_id: 0,
						description: 'go-getter',
						...defaultValues,
					},
					{
						id: 4,
						platform_id: 0,
						description: 'good comms',
						...defaultValues,
					},
					{
						id: 5,
						platform_id: 0,
						description: 'clutch master',
						...defaultValues,
					},
					{
						id: 6,
						platform_id: 1,
						description: 'builder',
						...defaultValues,
					},
					{
						id: 7,
						platform_id: 1,
						description: 'sharp shooter',
						...defaultValues,
					},
					{
						id: 8,
						platform_id: 1,
						description: 'game sense',
						...defaultValues,
					},
					{
						id: 9,
						platform_id: 1,
						description: 'farmer',
						...defaultValues,
					},
					{
						id: 10,
						platform_id: 1,
						description: 'electrician',
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in endorsement_types table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('endorsement_types', null, { truncate: true });
	},
};
