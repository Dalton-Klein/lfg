"use strinct";

const { users } = require("../models/index");
const created_by = (updated_by = "seeder_script");
const created_at = (updated_at = Date.now());
const defaultValues = { created_by, updated_by, created_at, updated_at };

module.exports = {
  up: async ({ context: sequelize }) => {
    const transaction = await sequelize.transaction();
    const existingRecords = await sequelize.query("select id from public.users", {
      type: sequelize.QueryTypes.SELECT,
    });
    if (!existingRecords.length) {
      await users.bulkCreate(
        [
          {
            id: 1,
            username: "admin",
            email: "deklein@live.com",
            avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1625509793/kaeobccovhx4qxafcpq3.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 2,
            username: "madison t",
            email: "mads@live.com",
            avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1625633717/dan_ogozui.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 3,
            username: "major t",
            email: "major@live.com",
            avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1625542844/test_3_x0jonh.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 4,
            username: "lauren t",
            email: "lauren@live.com",
            avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1659833713/sabina_fortnite_i2kyvg.png",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 5,
            username: "ashley t",
            email: "ashley@live.com",
            avatar_url:
              "https://res.cloudinary.com/kultured-dev/image/upload/v1659833832/fortnite-6278c8ea19fd0_qtfotj.jpg",
            hashed: "$2b$10$XPlxGS4lBoB1SnDMJc469.O85Q9HQo6Q/tRbCjwnbfj.Guv4y3ZSu",
            ...defaultValues,
          },
          {
            id: 6,
            username: "tiffany test",
            email: "tiffany@live.com",
            avatar_url:
              "https://res.cloudinary.com/kultured-dev/image/upload/v1659833832/fortnite-6278c8ea19fd0_qtfotj.jpg",
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
