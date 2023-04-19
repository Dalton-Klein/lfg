const db = require("../models/index");
const { sequelize } = require("../models/index");
const Sequelize = require("sequelize");
const {
  createGangRecord,
  createGangDefaultChannels,
  createGangRosterRecord,
  createGangRequestRecord,
  checkGangRequestStatusByUserId,
  checkGangRequestStatusByRequestId,
  deleteGangRequestRecord,
} = require("../services/gangs");
const format = require("pg-format");

const createGang = async (req, res) => {
  console.log(" ♛ A User Requested To Create A Gang ♛ ");
  try {
    const { userId, gang } = req.body;
    //Create gang record
    console.log("options: ", gang);
    const gangResult = await createGangRecord(gang);
    //Create default gang channel records
    console.log("gang result: ", gangResult);
    await createGangDefaultChannels(gangResult[0].id);
    //Create initial roster record for owner
    await createGangRosterRecord(gangResult[0].id, userId, 1);
    res.status(200).send(true);
  } catch (err) {
    console.log("CREATE GANG ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const getMyGangsTiles = async (req, res) => {
  console.log(" ♛ A User Requested Their Gangs ♛ ");
  try {
    const { userId } = req.body;
    gangsQuery = `
              select g.*, ro.name as role_name
                from public.gang_roster r
                join public.gangs g
                  on g.id = r.gang_id
                join public.gang_roles ro
                  on ro.id = r.role_id
               where r.user_id = :userId
            `;
    let foundGangs = await sequelize.query(gangsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
      },
    });
    foundGangs = await findRosterAvatars(foundGangs);
    res.status(200).send(foundGangs);
  } catch (err) {
    console.log("GET CHATS ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const findRosterAvatars = async (gangsArray) => {
  for (let i = 0; i < gangsArray.length; i++) {
    const gang = gangsArray[i];
    //Find other members within this gang, pull in avatars
    const membersQuery = `
        select u.avatar_url, u.username, u.id, r.id as role_id
          from public.gang_roster r
          join public.users u
            on u.id = r.user_id
         where r.gang_id = :gangId 
      order by r.role_id
    `;
    const foundMembers = await sequelize.query(membersQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        gangId: gang.id,
      },
    });
    gang.members = foundMembers;
  }
  return gangsArray;
};

const fetchGangConnectionRequests = async (req, res) => {
  console.log("iiiiii", req.body);
  try {
    const { id, is_for_user } = req.body;
    //Find other members within this gang, pull in avatars
    let gangConenctionsQuery;
    if (is_for_user) {
      gangConenctionsQuery = `
        select r.*, g.*
          from public.gang_requests r
          join public.gangs g
            on g.id = r.gang_id
         where r.gang_id = :id 
      `;
    } else {
      gangConenctionsQuery = `
      select r.*, u.username, u.avatar_url
        from public.gang_requests r
        join public.users u
          on u.id = r.user_id
       where r.gang_id = :id 
      `;
    }
    const foundRequests = await sequelize.query(gangConenctionsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        id,
      },
    });
    res.status(200).send(foundRequests);
  } catch (err) {
    console.log("GET GANG REQUESTS ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const getGangActivity = async (req, res) => {
  console.log(" ♛ A User Requested To Load Gang Page ♛ ");
  try {
    const { gang_id, user_id } = req.body;
    //Get Gang Public Info
    const basicGangInfoQuery = `
		  select id, 
				     name, 
				     about, 
				     avatar_url,
				     game_platform_id,
             chat_platform_id,
             is_public
			  from public.gangs
			 where id = :gang_id
		`;
    let foundGangInfo = await sequelize.query(basicGangInfoQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        gang_id,
      },
    });
    let finalizedGangInfo = await findRosterAvatars([foundGangInfo[0]]);
    //Find if user has role in gang
    const rosterQuery = `
              select r.role_id, ro.name as role_name
                from public.gang_roster r
                join public.gang_roles ro
                  on ro.id = r.role_id
               where r.user_id = :user_id
                 and r.gang_id = :gang_id
            `;
    let foundRole = await sequelize.query(rosterQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        user_id,
        gang_id,
      },
    });
    console.log("role result: ", foundRole);
    gangQuery = `
              select gc.id, 
                     gc.name, 
                     gc.privacy_level,
                     is_voice
                from public.gang_chats gc
               where gc.gang_id = :gang_id
            `;
    let gangChannels = await sequelize.query(gangQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        user_id,
        gang_id,
      },
    });
    let gangData = {};
    if (foundRole[0]) {
      //Prepare all gang data, because they are member
      gangData = {
        basicInfo: finalizedGangInfo[0],
        role: foundRole[0],
        channels: gangChannels,
      };
    } else {
      //Prepare partial gang data, because they are non-member
      //Check if user has already requested to join or not
      const requestResult = await checkGangRequestStatusByUserId(user_id, gang_id);
      console.log("heyyyy", requestResult);
      gangData = {
        basicInfo: finalizedGangInfo[0],
        role: foundRole[0],
        channels: {},
        requestStatus: requestResult,
      };
    }
    res.status(200).send(gangData);
  } catch (err) {
    console.log("GET GANG PAGE INFO ERROR", err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const updateGangField = async (req, res) => {
  try {
    const { gangId, field, value } = req.body;
    const reply = await updateGangFieldQuery(gangId, field, value);
    res.status(200).send(reply);
  } catch (err) {
    console.log(err);
    res.status(500).send("Update Gang Field ERROR");
  }
};

const updateGangFieldQuery = async (gangId, field, value) => {
  const query = format(
    `
    update public.gangs
      set %I = :value,
          updated_at = current_timestamp
    where id = :gangId
  `,
    field
  );
  const result = await sequelize.query(query, {
    type: Sequelize.QueryTypes.UPDATE,
    replacements: {
      gangId,
      field,
      value,
    },
  });
  return result;
};

const createGangRequest = async (req, res) => {
  try {
    const { gang_id, user_id, is_user_asking_to_join } = req.body;
    const result = await createGangRequestRecord(gang_id, user_id, is_user_asking_to_join);
    res.status(200).send(result);
  } catch (error) {
    console.log(err);
    res.status(500).send("Create Gang Request ERROR");
  }
};

const acceptGangConnectionRequest = async (req, res) => {
  try {
    const { gang_id, request_id } = req.body;
    //Get a copy of the request
    const requestResult = await checkGangRequestStatusByRequestId(request_id);
    //Create roster record
    console.log("request result:: ", requestResult);
    const result = await createGangRosterRecord(gang_id, requestResult[0].user_id, 5);
    //Remove request record
    await deleteGangRequestRecord(requestResult[0].id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Accept Gang Request ERROR");
  }
};

module.exports = {
  createGang,
  getMyGangsTiles,
  fetchGangConnectionRequests,
  getGangActivity,
  updateGangField,
  findRosterAvatars,
  createGangRequest,
  acceptGangConnectionRequest,
};
