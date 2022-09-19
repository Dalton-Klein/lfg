"use strinct";

const { supported_platforms } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from gangs.supported_platforms", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await supported_platforms.bulkCreate(
        [
          {
            id: 1,
            name: "rust",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in supported_platforms table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("supported_platforms", null, { truncate: true });
  },
};
