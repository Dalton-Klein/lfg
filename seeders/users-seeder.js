"use strinct";

const { users } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from codelounge.public.users", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await users.bulkCreate(
        [
          {
            id: 1,
            username: "admin",
            email: "deklein@live.com",
            about: "im the ceo bitch.",
            avatarUrl: "/assets/avatarIcon.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
        ],
        { transaction }
      );
    } else {
      console.log("Found existing data in users table, so seeder script will not insert data.");
    }
    return await transaction.commit();
  },
  down: async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().bulkDelete("users", null, { truncate: true });
  },
};
