const db = require("../models/index");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const { updateConnectionTimestamp, getConnectionDetails } = require("./connections-controller");
const { saveNotification } = require("./notification-controller");
const { createRedemptionForUser } = require("./redeems-controller");
const emailService = require("../services/auth");

const getMyTickets = async (req, res) => {
  const { userId } = req.body;
  try {
    query = `
          select t.*
            from public.tickets t
           where t.user_id = :userId
        order by t.created_at desc
    `;
    const tickets = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    res.status(200).send(tickets);
  } catch (err) {
    console.log(err);
    res.status(500).send(`GET Tickets ERROR: ${err}`);
  }
};

const insertTicket = async (req, res) => {
  const { userId, type, description, timestamp } = req.body;
  try {
    //First, insert message into messages table
    query = `
          insert into public.tickets ( user_id,
                                        type_id,
                                        description,
                                        status,
                                        created_at,
                                        updated_at)
              values (:user_id,
                      :type,
                      :description,
                      1,
                      current_timestamp,
                      current_timestamp)
    `;
    await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        user_id: userId,
        type,
        description,
      },
    });
    console.log("type? ", type);
    if (type === 1) {
      await createRedemptionForUser(userId, 11);
    }
    //Send myself an email so I can address tickets quickly
    emailService.sendEmail({ body: { email: process.env.EMAIL } }, `${userId} sent a ticket`, 7, "admin");
    res.status(200).send({ data: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send(`CREATE Ticket ERROR: ${err}`);
  }
};

module.exports = {
  getMyTickets,
  insertTicket,
};
