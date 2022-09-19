const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const format = require("pg-format");
const { getUserDataByIdQuery } = require("../services/user-queries");

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const query = getUserDataByIdQuery();
    let result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    if (result && result[0]) result = result[0];
    res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateProfileField = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    const query = format(
      `update public.users 
          set %I = :value,
              updated_at = current_timestamp
        where id = :userId
      `,
      field
    );
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        userId,
        value,
      },
    });
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateGeneralInfoField = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    const query = format(
      `
      update public.user_general_infos
        set %I = :value,
            updated_at = current_timestamp
      where user_id = :userId
    `,
      field
    );
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        userId,
        field,
        value,
      },
    });
    console.log("reply: ", reply);
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const updateRustInfoField = async (req, res) => {
  try {
    const { userId, field, value } = req.body;
    const query = format(
      `
      update public.user_rust_infos
        set %I = :value,
            updated_at = current_timestamp
      where user_id = :userId
    `,
      field
    );
    const reply = await sequelize.query(query, {
      type: Sequelize.QueryTypes.UPDATE,
      replacements: {
        userId,
        field,
        value,
      },
    });
    console.log("reply: ", reply);
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getSocialDetails = async (req, res) => {
  try {
    const { fromUserId, forUserId, token } = req.body;
    // const query = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
    let query = `select count(id)
         from public.connections 
        where sender = :userId
           or acceptor = :userId
    `;
    const connectionCount = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: forUserId,
      },
    });
    query = ` select acceptor
          from public.connections 
         where sender = :userId
               union
        select sender
          from public.connections 
         where acceptor = :userId
    `;
    let connectionListFor = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: forUserId,
      },
    });
    let connectionListFrom = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId: fromUserId,
      },
    });
    //logic to find number of mutuals between two unused arrays
    connectionListFor = connectionListFor.map(({ acceptor }) => acceptor);
    connectionListFrom = connectionListFrom.map(({ acceptor }) => acceptor);
    let intersection = connectionListFor.filter((e) => connectionListFrom.indexOf(e) !== -1);
    const result = {
      connections: connectionCount ? connectionCount[0].count : 0,
      mutual: intersection ? intersection.length : 0,
    };
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const { fromUserId, forUserId, platform, connectionText, token } = req.body;
    console.log("req body: ", req.body);
    let query = `
      insert into public.connection_requests  (sender, receiver, platform, message, created_at, updated_at)
      values (:sender, :receiver, :platform, :message, current_timestamp, current_timestamp)
    `;
    const connectionInsertResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        sender: fromUserId,
        receiver: forUserId,
        message: connectionText,
        platform,
      },
    });
    const result = {
      status: "success",
      data: "created connection request",
    };
    if (connectionInsertResult) res.status(200).send(result);
    else throw new Error("Failed to create connection request");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

module.exports = {
  getUserDetails,
  updateProfileField,
  updateGeneralInfoField,
  updateRustInfoField,
  getSocialDetails,
  sendConnectionRequest,
};
