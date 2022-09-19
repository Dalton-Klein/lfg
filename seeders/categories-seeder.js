"use strinct";

const { categories } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from gangs.categories", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await categories.bulkCreate(
        [
          {
            id: 1,
            name: "rust",
            color: "Rust",
            ...defaultValues,
          },
          {
            id: 2,
            name: "fortnite",
            color: "PapayaWhip",
            ...defaultValues,
          },
          {
            id: 3,
            name: "world of warcraft",
            color: "PaleGreen",
            ...defaultValues,
          },
          {
            id: 4,
            name: "minecraft",
            color: "Plum",
            ...defaultValues,
          },
          {
            id: 5,
            name: "rocket league",
            color: "MintCream",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in categories table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("categories", null, { truncate: true });
  },
};
