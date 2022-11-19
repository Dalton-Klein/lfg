'use strinct';

const { gang_roles } = require('../../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		const existingRecords = await sequelize.query('select id from public.gang_roles', {
			type: sequelize.QueryTypes.SELECT,
		});
		if (!existingRecords.length) {
			await gang_roles.bulkCreate(
				[
					{
						id: 1,
						name: 'owner',
						...defaultValues,
					},
					{
						id: 2,
						name: 'president',
						...defaultValues,
					},
					{
						id: 3,
						name: 'executive',
						...defaultValues,
					},
					{
						id: 4,
						name: 'manager',
						...defaultValues,
					},
					{
						id: 5,
						name: 'member',
						...defaultValues,
					},
					{
						id: 6,
						name: 'recruit',
						...defaultValues,
					},
				],
				{ transaction }
			);
		} else {
			console.log('Found existing data in gang_roles table, so seeder script will not insert data.');
		}
		return await transaction.commit();
	},
	down: async ({ context: sequelize }) => {
		await sequelize.getQueryInterface().bulkDelete('gang_roles', null, { truncate: true });
	},
};
