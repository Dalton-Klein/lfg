require("dotenv").config();
const db = require("../models/index");
const bcrypt = require("bcrypt");
const services = require("../services/auth");
const { getUserDataQuery, createUserQuery, createGeneralInfoQuery, createRustInfoQuery } = require("../services/user-queries");
const { users, user_tokens, v_keys, sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const UserTable = users;
const TokenTable = user_tokens;
const vKeyTable = v_keys;

/*
Sign In Logic
*/
exports.signin = async (req, res) => {
  try {
    console.log(" ♛ A User Requested Sign In ♛ ");
    const { email, password } = req.body;
    const query = getUserDataQuery();
    let user = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        email,
      },
    });
    console.log("user? ", user);
    let result = "";
    if (user !== null) {
      //If matching user is found, compare passwords
      const validPass = await bcrypt.compare(password, user.hashed);
      if (validPass) {
        const token = services.keyGen(15);
        await TokenTable.destroy({ where: { id: user.id } }); //delete Old tokens
        user = user.dataValues;
        const newToken = await TokenTable.create({ id: user.id, token });
        delete user.hashed;
        result = { token: newToken.token, data: user };
      } else result = { error: "one of your credentials is incorrect" };
    } else result = { error: "one of your credentials is incorrect" };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
/*
Sign Up Logic
*/
exports.signup = async (req, res) => {
  try {
    console.log("♛ A User Requested Sign Up ♛");
    validateCredentials(req, res);
    const doesEmailAlreadyExist = await checkIfEmailExists(req);
    const doesUserNameAlreadyExist = await checkIfUserNameExists(req);
    if (doesUserNameAlreadyExist.length !== 0) {
      res.send({
        error: "display name already in use.",
      });
    } else if (doesEmailAlreadyExist.length !== 0) {
      res.send({
        error: "email already in use.",
      });
    } else {
      const vKey = services.keyGen(5);
      await insertVKey(req, vKey);
      // coffee disable
      // await services.sendEmail(req, vKey, 1, req.body.username);
      res.send({
        data: "vKeySentToEmail",
      });
    }
  } catch (error) {
    console.error(error);
    res.send({
      error: "error sending verification email",
    });
  }
};

const validateCredentials = (req, res) => {
  if (req.body.username.length <= 3) {
    res.send({
      error: "display name is too short",
    });
  }
  if (req.body.email.length <= 7) {
    res.send({
      error: "email is too short",
    });
  }
};

const checkIfEmailExists = async (req) => {
  const query = `
    select * 
      from lfg.public.users
     where email = :email;
  `;
  const queryOptions = {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      email: req.body.email,
    },
  };
  return await sequelize.query(query, queryOptions);
};

const checkIfUserNameExists = async (req) => {
  const query = `
    select * 
      from lfg.public.users
     where username = :username;
  `;
  const queryOptions = {
    type: Sequelize.QueryTypes.SELECT,
    replacements: {
      username: req.body.username,
    },
  };
  return await sequelize.query(query, queryOptions);
};

const insertVKey = async (req, vKey) => {
  const email = req.body.email;
  const filter = { where: { email: email } };
  let keyFound = await vKeyTable.findOne(filter);
  console.log("👻👻👻what is key: ", vKey);
  if (keyFound === null) {
    await vKeyTable.create({
      email: email,
      vkey: vKey,
    });
  } else {
    await keyFound.update({
      vkey: vKey,
    });
  }
  return;
};

/*
Verify Logic
*/
exports.verify = async (req, res) => {
  try {
    const filter = {
      where: {
        email: req.body.email,
        vkey: req.body.vKey,
      },
    };
    let keyFound = await vKeyTable.findOne(filter);
    if (keyFound === null) {
      res.send({
        error: "invalid verification key",
      });
    } else {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const accountObject = {
        email: req.body.email,
        username: req.body.username,
        hashed: hashedPass,
      };
      let accountCreationResult = await insertNewUser(accountObject);
      let user = accountCreationResult[0][0];
      if (user) {
        delete user.hashed;
        await vKeyTable.destroy(filter);
        const token = services.keyGen(15);
        const newToken = await TokenTable.create({ id: user.id, token });
        res.status(200).json({
          data: user,
          token: newToken.token,
        });
      } else {
        throw new Error("error");
      }
    }
  } catch (error) {
    console.error(error);
    res.send({
      error: "error creating account, contact support",
    });
  }
};

const insertNewUser = async (userObj) => {
  const transaction = await sequelize.transaction();
  try {
    let query = createUserQuery();
    let queryOptions = {
      type: Sequelize.QueryTypes.INSERT,
      replacements: {
        username: userObj.username,
        email: userObj.email,
        hashed: userObj.hashed,
      },
      transaction,
    };
    const userResult = await sequelize.query(query, queryOptions);
    query = createGeneralInfoQuery();
    console.log("userResult: ", userResult[0][0]);
    queryOptions.replacements.userId = userResult[0][0].id;
    await sequelize.query(query, queryOptions);
    query = createRustInfoQuery();
    await sequelize.query(query, queryOptions);
    await transaction.commit();
    return userResult;
  } catch (error) {
    await transaction.rollback();
    console.log("error creating user records, rolling back: ", error);
  }
};

const insertToken = async (userId, token) => {
  const query = `
  insert into lfg.public.user_tokens (token, created_at, updated_at)
       values (:token, current_timestamp, current_timestamp)
    returning token
  `;
  const queryOptions = {
    type: Sequelize.QueryTypes.INSERT,
    replacements: {
      token,
    },
  };
  return await sequelize.query(query, queryOptions);
};

/*
Request New Password Logic
*/
exports.forgotPassword = async (req, res) => {
  try {
    const userResult = await UserTable.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log("@@@ ", userResult);
    if (userResult === null) {
      res.send({
        error: "no account found with that email",
      });
    } else {
      const vKey = services.keyGen(5);
      await insertVKey(req, vKey);
      // coffee disable
      await services.sendEmail(req, vKey, 2, userResult.dataValues.username);
      res.send({
        data: "vKeySentToEmail",
      });
    }
  } catch (error) {
    console.error(error);
    res.send({
      error: "error requesting password reset",
    });
  }
};

/*
Reset Password Logic
*/
exports.resetPassword = async (req, res) => {
  try {
    const filter = {
      where: {
        email: req.body.email,
        vkey: req.body.vKey,
      },
    };
    let keyFound = await vKeyTable.findOne(filter);
    if (keyFound === null) {
      res.send({
        error: "invalid verification key",
      });
    } else {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const passwordObject = {
        hashed: hashedPass,
      };
      const resetFilter = {
        where: {
          email: req.body.email,
        },
      };
      let passwordUpdateResult = await UserTable.update(passwordObject, resetFilter);
      if (passwordUpdateResult[0] === 1) {
        await vKeyTable.destroy(filter);
        let userData = await UserTable.findOne({ where: { email: req.body.email } });
        delete userData.dataValues.hashed;
        res.status(200).json({
          data: userData.dataValues,
        });
      } else {
        throw Error("error");
      }
    }
  } catch (error) {
    console.error(error);
    res.send({
      error: "error resetting password, contact support",
    });
  }
};

/*
Get Public User Details Logic
*/
exports.getPublicDetails = async (req, res) => {
  try {
    const { id, token } = req.headers;
    let tokenValid;
    if (token) {
      tokenValid = await services.checkToken(id, token);
    }
    let reply = "";
    if (tokenValid === true || process.env.IS_PRODUCTION === "false") {
      const { id } = req.body;
      const filter = { where: { id: id } };
      let user = await db.UserData.findOne(filter);
      reply = {
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        trainerID: user.trainerID,
        trainerName: user.trainerName,
        mtgoID: user.mtgoID,
        mtgoName: user.mtgoName,
        buyerRating: user.buyerRating,
        sellerRating: user.sellerRating,
        sales: user.transactionSales.length,
        purchases: user.transactionPurchases.length,
        trades: user.transactionTrades.length,
        watchList: user.watchList,
      };
    }
    res.status(200).send(reply);
  } catch (error) {
    console.log("POST ERROR", error);
    res.status(500).send("POST ERROR");
  }
};
