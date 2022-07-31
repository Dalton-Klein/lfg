"use strinct";

const { userGeneralInfo } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from lfg.public.user_general_infos", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await userGeneralInfo.bulkCreate(
        [
          {
            id: 1,
            user_id: 1,
            about: "Avid rust player and creator of lfg.",
            age: 28,
            gender: 1,
            region: 1,
            languages: ["English"],
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in user_general_info table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("user_general_info", null, { truncate: true });
  },
};
