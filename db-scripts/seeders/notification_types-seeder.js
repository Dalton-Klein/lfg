'use strinct';

const { notification_types } = require('../../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.notification_types', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await notification_types.bulkCreate(
				[
					{
						id: 1,
						name: 'connection request',
						...defaultValues,
					},
					{
						id: 2,
						name: 'accepted request',
						...defaultValues,
					},
					{
						id: 3,
						name: 'message',
						...defaultValues,
					},
					{
						id: 4,
						name: 'signup',
						...defaultValues,
					},
					{
						id: 5,
						name: 'endorsement',
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in notification_types table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('notification_types', null, { truncate: true });
	},
};
