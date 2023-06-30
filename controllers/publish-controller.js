require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const {
  checkGameProfileCompletionQuery,
  checkIfUserCanPublishRustProfileQuery,
  checkIfUserCanPublishRocketLeagueProfileQuery,
  getAllProfilesPublicationStatusQuery,
} = require("../services/publish-queries");
const { createRedemptionForUser } = require("./redeems-controller");

/*
Check General Profile
*/
const checkGeneralProfileCompletion = async (req, res) => {
  try {
    console.log(" ♛ A User Checking General Profile Completion ♛ ");
    const { userId, token } = req.body;
    let query = checkGameProfileCompletionQuery("user_general_infos");
    let queryResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    let passesValidation = false;
    let problemFields = [];
    //Validate result here
    queryResult = queryResult[0];
    // General Fields
    if (queryResult.about === null || queryResult.about === "") problemFields.push("about");
    if (queryResult.age === null || queryResult.age < 13) problemFields.push("age");
    if (queryResult.gender === null || queryResult.gender === 0) problemFields.push("gender");
    if (queryResult.region === null || queryResult.region === 0) problemFields.push("region");
    if (queryResult.languages === null) problemFields.push("language");
    if (queryResult.preferred_platform === null) problemFields.push("platform");
    if (!problemFields.length) passesValidation = true;
    if (passesValidation) {
      await createRedemptionForUser(userId, 2);
    }
    let result = {
      status: passesValidation ? "success" : "error",
      data: problemFields,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
check rust profile
*/
const checkRustProfileCompletion = async (req, res) => {
  try {
    console.log(" ♛ A User Checking Rust Profile Completion ♛ ");
    const { userId, token } = req.body;
    let query = checkGameProfileCompletionQuery("user_rust_infos");
    let queryResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    let passesValidation = false;
    let problemFields = [];
    //Validate result here
    queryResult = queryResult[0];
    // Rust Fields
    if (queryResult.hours === null || queryResult.hours === 0) problemFields.push("hours");
    if (queryResult.server_type_id === null || queryResult.server_type_id === 0) {
      problemFields.push("server preference");
    }
    if (queryResult.wipe_day_preference === null || queryResult.wipe_day_preference === "") {
      problemFields.push("wipe day preference");
    }
    if (queryResult.weekdays === null || queryResult.weekdays === 0) problemFields.push("weekday availability");
    if (queryResult.weekdends === null || queryResult.weekdends === 0) problemFields.push("weekend availability");
    if (!problemFields.length) passesValidation = true;
    let result = {
      status: passesValidation ? "success" : "error",
      data: problemFields,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
check rocket league profile
*/
const checkRocketLeagueProfileCompletion = async (req, res) => {
  try {
    console.log(" ♛ A User Checking Rocket League Profile Completion ♛ ");
    const { userId, token } = req.body;
    let query = checkGameProfileCompletionQuery("user_rocket_league_infos");
    let queryResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    let passesValidation = false;
    let problemFields = [];
    //Validate result here
    queryResult = queryResult[0];
    // Rocket League Fields
    if (queryResult.preferred_playlist === null || queryResult.preferred_playlist === 0) problemFields.push("playlist");
    if (queryResult.rank === null || queryResult.rank === 0) problemFields.push("rank");
    if (queryResult.hours === null || queryResult.hours === 0) problemFields.push("hours");
    if (queryResult.weekdays === null || queryResult.weekdays === 0) problemFields.push("weekday availability");
    if (queryResult.weekdends === null || queryResult.weekdends === 0) problemFields.push("weekend availability");
    if (!problemFields.length) passesValidation = true;
    let result = {
      status: passesValidation ? "success" : "error",
      data: problemFields,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getAllProfilesPublicationStatusForUser = async (req, res) => {
  try {
    console.log(" ♛ A User Requested To Get Publish Status for All Profiles ♛ ");
    const { userId, token } = req.body;
    let query = getAllProfilesPublicationStatusQuery();
    let result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    if (result) {
      res.status(200).send({ status: "success", data: result[0] });
    } else throw new Error("Unable to find profile publication status");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
check rust and gen profile at once
*/
const checkIfUserCanPublishRustProfile = async (req, res) => {
  try {
    console.log(" ♛ A User Requested To Publish Rust Profile ♛ ");
    const { userId, token } = req.body;
    let query = checkIfUserCanPublishRustProfileQuery();
    let queryResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    let passesValidation = false;
    let problemFields = [];
    //Validate result here
    queryResult = queryResult[0];
    // General Fields
    if (queryResult.about === null || queryResult.about === "") problemFields.push("about");
    if (queryResult.age === null || queryResult.age < 13) problemFields.push("age");
    if (queryResult.gender === null || queryResult.gender === 0) problemFields.push("gender");
    if (queryResult.region === null || queryResult.region === 0) problemFields.push("region");
    if (queryResult.languages === null) problemFields.push("language");
    if (queryResult.preferred_platform === null) problemFields.push("platform");
    // Rust Fields
    if (queryResult.hours === null || queryResult.hours === 0) problemFields.push("hours");
    if (queryResult.weekdays === null || queryResult.weekdays === 0) problemFields.push("weekday availability");
    if (queryResult.weekdends === null || queryResult.weekdends === 0) problemFields.push("weekend availability");
    if (!problemFields.length) passesValidation = true;
    let result = {
      status: passesValidation ? "success" : "error",
      data: problemFields,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/*
check rocket league and gen profile at once
*/
const checkIfUserCanPublishRocketLeagueProfile = async (req, res) => {
  try {
    console.log(" ♛ A User Requested To Publish Rust Profile ♛ ");
    const { userId, token } = req.body;
    let query = checkIfUserCanPublishRocketLeagueProfileQuery();
    let queryResult = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    let passesValidation = false;
    let problemFields = [];
    //Validate result here
    queryResult = queryResult[0];
    // General Fields
    if (queryResult.about === null || queryResult.about === "") problemFields.push("about");
    if (queryResult.age === null || queryResult.age < 13) problemFields.push("age");
    if (queryResult.gender === null || queryResult.gender === 0) problemFields.push("gender");
    if (queryResult.region === null || queryResult.region === 0) problemFields.push("region");
    if (queryResult.languages === null) problemFields.push("language");
    if (queryResult.preferred_platform === null) problemFields.push("platform");
    // RocketLeague Fields
    if (queryResult.preferred_playlist === null || queryResult.preferred_playlist === 0) problemFields.push("playlist");
    if (queryResult.rank === null || queryResult.rank === 0) problemFields.push("rank");
    if (queryResult.hours === null || queryResult.hours === 0) problemFields.push("hours");
    if (queryResult.weekdays === null || queryResult.weekdays === 0) problemFields.push("weekday availability");
    if (queryResult.weekdends === null || queryResult.weekdends === 0) problemFields.push("weekend availability");
    if (!problemFields.length) passesValidation = true;
    let result = {
      status: passesValidation ? "success" : "error",
      data: problemFields,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  checkGeneralProfileCompletion,
  getAllProfilesPublicationStatusForUser,
  checkRustProfileCompletion,
  checkRocketLeagueProfileCompletion,
  checkIfUserCanPublishRustProfile,
  checkIfUserCanPublishRocketLeagueProfile,
};
