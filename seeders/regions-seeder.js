"use strinct";

const { regions } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from gangs.regions", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await regions.bulkCreate(
        [
          {
            id: 1,
            name: "north america west",
            abbreviation: "na west",
            ...defaultValues,
          },
          {
            id: 2,
            name: "north america east",
            abbreviation: "na east",
            ...defaultValues,
          },
          {
            id: 3,
            name: "europe",
            abbreviation: "eu",
            ...defaultValues,
          },
          {
            id: 4,
            name: "south america",
            abbreviation: "sa",
            ...defaultValues,
          },
          {
            id: 5,
            name: "asia",
            abbreviation: "as",
            ...defaultValues,
          },
          {
            id: 6,
            name: "oceania",
            abbreviation: "oc",
            ...defaultValues,
          },
          {
            id: 7,
            name: "africa",
            abbreviation: "af",
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
