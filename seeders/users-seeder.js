"use strinct";

const { users } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from lfg.public.users", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await users.bulkCreate(
        [
          {
            id: 1,
            username: "admin",
            email: "deklein@live.com",
            avatarUrl: "/assets/avatarIcon.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 2,
            username: "madison t",
            email: "mads@live.com",
            avatarUrl: "/assets/avatarIcon.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 3,
            username: "major t",
            email: "major@live.com",
            avatarUrl: "/assets/avatarIcon.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 4,
            username: "lauren t",
            email: "lauren@live.com",
            avatarUrl: "/assets/avatarIcon.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 5,
            username: "ashley t",
            email: "ashley@live.com",
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
