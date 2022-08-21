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
      `update lfg.public.users 
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
    console.log("valie??? ", req.body);
    const { userId, field, value } = req.body;
    const query = format(
      `
      update lfg.public.user_general_infos
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

module.exports = {
  getUserDetails,
  updateProfileField,
  updateGeneralInfoField,
};
