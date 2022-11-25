'use strinct';

const { gang_privacy_levels } = require('../../models/index');
const created_by = (updated_by = 'seeder_script');
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query('select id from public.gang_privacy_levels', {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await gang_privacy_levels.bulkCreate(
        [
          {
            id: 1,
            description: 'president and owners only',
            ...defaultValues,
          },
          {
            id: 2,
            description: 'executives and above',
            ...defaultValues,
          },
          {
            id: 3,
            description: 'managers and above',
            ...defaultValues,
          },
          {
            id: 4,
            description: 'members and above',
            ...defaultValues,
          },
          {
            id: 5,
            description: 'all members including recruits',
            ...defaultValues,
          },
          {
            id: 6,
            description: 'public, including non-members',
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log('Found existing data in gang_privacy_levels table, so seeder script will not insert data.');
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete('gang_privacy_levels', null, { truncate: true });
  },
};
