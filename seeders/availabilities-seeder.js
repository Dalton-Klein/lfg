"use strinct";

const { availabilities } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from lfg.public.availabilities", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await availabilities.bulkCreate(
        [
          {
            id: 1,
            name: "none",
            description: "0 hours",
            ...defaultValues,
          },
          {
            id: 2,
            name: "some",
            description: "0-2 hours",
            ...defaultValues,
          },
          {
            id: 3,
            name: "a lot",
            description: "2-6 hours",
            ...defaultValues,
          },
          {
            id: 4,
            name: "all day",
            description: "6+ hours",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in availabilities table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("availabilities", null, { truncate: true });
  },
};
