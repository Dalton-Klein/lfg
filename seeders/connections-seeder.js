"use strinct";

const { connections } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from gangs.connections", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await connections.bulkCreate(
        [
          {
            id: 1,
            sender: 1,
            acceptor: 2,
            platform: 1,
            ...defaultValues,
          },
          {
            id: 2,
            sender: 1,
            acceptor: 3,
            platform: 1,
            ...defaultValues,
          },
          {
            id: 3,
            sender: 2,
            acceptor: 3,
            platform: 1,
            ...defaultValues,
          },
          {
            id: 4,
            sender: 1,
            acceptor: 4,
            platform: 1,
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in connections table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("connections", null, { truncate: true });
  },
};
