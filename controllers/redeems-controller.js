require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const moment = require("moment");

const getAllRedeemTypes = async (req, res) => {
  try {
    //Check if request already exists and is pending
    let query = `
    select *
      from public.redeem_types
    `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    if (result) res.status(200).send(result);
    else throw new Error("Failed to get redemtion options");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const getAllRedemptionsForUser = async (req, res) => {
  const { userId, token } = req.body;
  try {
    //Check if request already exists and is pending
    let query = `
    select *
      from public.redeems r
      where r.user_id = :userId
    `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    if (result) res.status(200).send(result);
    else throw new Error("Failed to get redemtion options");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const createRedemptionForUser = async (req, res) => {
  const { userId, typeId, token } = req.body;
  try {
    //Check if max redeems have been met already
    let query = `
        insert into public.redeems  (sender, receiver, platform, message, created_at, updated_at)
        values (:sender, :receiver, :platform, :message, current_timestamp, current_timestamp)
      `;
    const redemptionInsertResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        sender: fromUserId,
        receiver: forUserId,
        message: connectionText,
        platform,
      },
    });
    if (redemptionInsertResult) res.status(200).send(redemptionInsertResult);
    else throw new Error("Failed to get redemtion options");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

module.exports = {
  getAllRedeemTypes,
  getAllRedemptionsForUser,
};
