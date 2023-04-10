const db = require('../models/index');
const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');
const { createGangRecord, createGangDefaultChannels, createGangRosterRecord } = require('../services/gangs');

const createGang = async (req, res) => {
  console.log(' ♛ A User Requested To Create A Gang ♛ ');
  try {
    const { userId, gang } = req.body;
    //Create gang record
    console.log('options: ', gang);
    const gangResult = await createGangRecord(gang);
    //Create default gang channel records
    console.log('gang result: ', gangResult);
    await createGangDefaultChannels(gangResult[0].id);
    //Create initial roster record for owner
    await createGangRosterRecord(gangResult[0].id, userId, 1);
    res.status(200).send(true);
  } catch (err) {
    console.log('CREATE GANG ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const getMyGangsTiles = async (req, res) => {
  console.log(' ♛ A User Requested Their Gangs ♛ ');
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
    console.log('GET CHATS ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const findRosterAvatars = async (gangsArray) => {
  for (let i = 0; i < gangsArray.length; i++) {
    const gang = gangsArray[i];
    //Find other members within this gang, pull in avatars
    const membersQuery = `
        select u.avatar_url, u.id
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

const getGangActivity = async (req, res) => {
  console.log(' ♛ A User Requested To Load Gang Page ♛ ');
  try {
    const { gangId, userId } = req.body;
    //Get Gang Public Info
    const basicGangInfoQuery = `
		  select id, 
				     name, 
				     about, 
				     avatar_url,
				     game_platform_id
			  from public.gangs
			 where id = :gangId
		`;
    let foundGangInfo = await sequelize.query(basicGangInfoQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        gangId,
      },
    });
    let finalizedGangInfo = await findRosterAvatars([foundGangInfo[0]]);
    //Find if user has role in gang
    const rosterQuery = `
              select r.role_id, ro.name as role_name
                from public.gang_roster r
                join public.gang_roles ro
                  on ro.id = r.role_id
               where r.user_id = :userId
                 and r.gang_id = :gangId
            `;
    let foundRole = await sequelize.query(rosterQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
        gangId,
      },
    });
    gangQuery = `
              select gc.id, 
                     gc.name, 
                     gc.privacy_level,
                     is_voice
                from public.gang_chats gc
               where gc.gang_id = :gangId
            `;
    let gangChannels = await sequelize.query(gangQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {
        userId,
        gangId,
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
      gangData = {
        basicInfo: finalizedGangInfo[0],
        role: foundRole[0],
        channels: {},
      };
    }
    res.status(200).send(gangData);
  } catch (err) {
    console.log('GET GANG PAGE INFO ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

const getGangTiles = async (req, res) => {
  console.log(' ♛ A User Requested Their Gangs ♛ ');
  try {
    const { userId } = req.body;
    gangsQuery = `
        select *
          from public.gangs g
    `;
    let foundGangs = await sequelize.query(gangsQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {},
    });
    foundGangs = await findRosterAvatars(foundGangs);
    console.log('heyyyyyyyyyy, ', foundGangs);
    res.status(200).send(foundGangs);
  } catch (err) {
    console.log('GET CHATS ERROR', err);
    res.status(500).send(`GET ERROR: ${err}`);
  }
};

module.exports = {
  createGang,
  getMyGangsTiles,
  getGangActivity,
  getGangTiles,
};
