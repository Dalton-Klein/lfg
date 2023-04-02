'use strinct';

const { chat_platforms } = require('../../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.chat_platforms', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await chat_platforms.bulkCreate(
				[
					{
						id: 1,
						name: 'discord',
						...defaultValues,
					},
					{
						id: 2,
						name: 'psn',
						...defaultValues,
					},
					{
						id: 3,
						name: 'xbox',
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in chat_platforms table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('chat_platforms', null, { truncate: true });
	},
};
