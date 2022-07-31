"use strinct";

const { regions } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from lfg.public.regions", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await regions.bulkCreate(
        [
          {
            id: 1,
            name: "North America West",
            abbreviation: "NA West",
            ...defaultValues,
          },
          {
            id: 2,
            name: "North America East",
            abbreviation: "NA East",
            ...defaultValues,
          },
          {
            id: 3,
            name: "Europe",
            abbreviation: "EU",
            ...defaultValues,
          },
          {
            id: 4,
            name: "South America",
            abbreviation: "SA",
            ...defaultValues,
          },
          {
            id: 5,
            name: "Asia",
            abbreviation: "AS",
            ...defaultValues,
          },
          {
            id: 6,
            name: "Oceania",
            abbreviation: "OC",
            ...defaultValues,
          },
          {
            id: 7,
            name: "Africa",
            abbreviation: "AF",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in regions table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("regions", null, { truncate: true });
  },
};
