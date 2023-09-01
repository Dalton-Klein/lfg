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

const getTicketDetails = async (req, res) => {
  const { ticketId } = req.body;
  try {
    query = `
           select tm.*, 
                  u.id as senderId, 
                  u.username, 
                  u.avatar_url, 
                  rd.rank,
                  re.count_love, 
                  re.count_thumbs_down, 
                  re.count_thumbs_up, 
                  re.count_one_hunderd,
                  re.count_fire,
                  re.count_skull
             from public.ticket_messages tm
             join public.users u
               on u.id = tm.sender
            left join (
                SELECT user_id, 
                        SUM(points) as rank
                  FROM public.redeems
              GROUP BY user_id
              ) rd on rd.user_id = u.id
            left join (
                SELECT message_id, 
                        scope_id,
                        SUM(CASE WHEN type_id = 1 THEN 1 ELSE 0 END) as count_love,
                        SUM(CASE WHEN type_id = 2 THEN 1 ELSE 0 END) as count_thumbs_down,
                        SUM(CASE WHEN type_id = 3 THEN 1 ELSE 0 END) as count_thumbs_up,
                        SUM(CASE WHEN type_id = 4 THEN 1 ELSE 0 END) as count_one_hunderd,
                        SUM(CASE WHEN type_id = 5 THEN 1 ELSE 0 END) as count_fire,
                        SUM(CASE WHEN type_id = 6 THEN 1 ELSE 0 END) as count_skull
                  FROM public.reactions
                  WHERE scope_id = 2
              GROUP BY message_id, scope_id
              ) re ON re.message_id = tm.id
            where tm.ticket_id = :ticketId
              and tm.is_deleted = false
         group by tm.id, 
                  u.id, 
                  u.username, 
                  u.avatar_url, 
                  rd.rank, 
                  re.count_love, 
                  re.count_thumbs_down, 
                  re.count_thumbs_up, 
                  re.count_one_hunderd,
                  re.count_fire,
                  re.count_skull
         order by tm.created_at asc
    `;
    const ticketDetails = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        ticketId,
      },
    });
    res.status(200).send(ticketDetails);
  } catch (err) {
    console.log(err);
    res.status(500).send(`GET Tickets ERROR: ${err}`);
  }
};

module.exports = {
  getMyTickets,
  insertTicket,
  getTicketDetails,
};
