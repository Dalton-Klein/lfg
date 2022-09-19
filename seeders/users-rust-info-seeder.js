'use strinct';

const { user_rust_infos } = require('../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.user_rust_infos', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await user_rust_infos.bulkCreate(
				[
					{
						id: 1,
						user_id: 1,
						weekdays: 1,
						weekends: 4,
						roles: [1],
						play_styles: [1],
						hours: 500,
						is_published: true,
						...defaultValues,
					},
					{
						id: 2,
						user_id: 2,
						weekdays: 2,
						weekends: 2,
						roles: [2],
						play_styles: [3, 4],
						hours: 1100,
						is_published: true,
						...defaultValues,
					},
					{
						id: 3,
						user_id: 3,
						weekdays: 4,
						weekends: 4,
						roles: [3],
						play_styles: [1, 3],
						hours: 950,
						is_published: true,
						...defaultValues,
					},
					{
						id: 4,
						user_id: 4,
						weekdays: 2,
						weekends: 3,
						roles: [2],
						play_styles: [3],
						hours: 28,
						is_published: true,
						...defaultValues,
					},
					{
						id: 5,
						user_id: 5,
						weekdays: 1,
						weekends: 2,
						roles: [1, 2],
						play_styles: [2, 3],
						hours: 3000,
						is_published: true,
						...defaultValues,
					},
					{
						id: 6,
						user_id: 6,
						weekdays: 1,
						weekends: 2,
						roles: [1, 2],
						play_styles: [2, 3],
						hours: 960,
						is_published: true,
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in user_rust_infos table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('user_rust_infos', null, { truncate: true });
	},
};
