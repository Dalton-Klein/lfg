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
    if (result) res.status(200).send({ data: result });
    else throw new Error("Failed to get redemtion options");
  } catch (err) {
    console.log(err);
    res.status(500).send("POST ERROR");
  }
};

const createRedemptionForUser = async (userId, typeId) => {
  try {
    let query = `
          select count(*) as count, max(created_at) as created_at 
            from public.redeems r
           where r.user_id = :userId
             and r.redeem_type_id = :typeId
    `;
    //Check if max redeems have been met already
    const currentRedeemCount = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
        typeId,
      },
    });
    query = `
          select rt.max_redeems, rt.points
            from public.redeem_types rt
           where rt.id = :typeId
    `;
    const redeemTypeRecord = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        typeId,
      },
    });
    //Insert new redemption if max not met and daily isn't already complete
    let alreadyComplete = false;
    if ([8, 9].includes(parseInt(typeId))) {
      //Check if daily challenge has already been completed
      alreadyComplete = moment().isSame(currentRedeemCount[0].created_at, "day");
    }
    if (!alreadyComplete && currentRedeemCount[0].count < redeemTypeRecord[0].max_redeems) {
      query = `
          insert into public.redeems  (user_id, redeem_type_id, points, created_at, updated_at)
          values (:userId, :typeId, :points, current_timestamp, current_timestamp)
        `;
      const redemptionInsertResult = await sequelize.query(query, {
        type: Sequelize.QueryTypes.INSERT,
        replacements: {
          userId,
          typeId,
          points: redeemTypeRecord[0].points,
        },
      });
      if (redemptionInsertResult) return { data: redemptionInsertResult };
      else return { error: "Failed to insert redemption" };
    } else {
      return { error: "max redeems met" };
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed when trying to insert redemption");
  }
};

module.exports = {
  getAllRedeemTypes,
  getAllRedemptionsForUser,
  createRedemptionForUser,
};
