'use strinct';

const { messages } = require('../../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.messages', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await messages.bulkCreate(
				[
					{
						connection_id: 1,
						sender: 1,
						content: 'test message 1',
						...defaultValues,
					},
					{
						connection_id: 1,
						sender: 3,
						content: 'test message 2 from user 3.',
						...defaultValues,
					},
					{
						connection_id: 1,
						sender: 5,
						content: 'test message 3 from user 5.',
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in messages table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('messages', null, { truncate: true });
	},
};
