const db = require('../models/index');
const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');

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
		console.log('gang result: ', foundGangs);
		foundGangs = await findRosterAvatars(foundGangs);
		console.log('final result: ', foundGangs);
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
		console.log('in loop gang: ', foundMembers.length);
	}
	return gangsArray;
};

const getGangActivity = async (req, res) => {
	console.log(' ♛ A User Requested Their Gangs ♛ ');
	try {
		const { gangId, userId } = req.body;
		//Find if user has role in gang
		rosterQuery = `
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
		console.log('role result: ', foundRole);
		gangQuery = `
              select r.role_id, ro.name as role_name
                from public.gang_roster r
                join public.gang_roles ro
                  on ro.id = r.role_id
               where r.user_id = :userId
                 and r.gang_id = :gangId
            `;
		let gangActivity = await sequelize.query(gangQuery, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				userId,
				gangId,
			},
		});
		if (foundRole[1]) {
			//Prepare all gang data, because they are member
		} else {
			//Prepare partial gang data, because they are non-member
		}
		res.status(200).send(gangActivity);
	} catch (err) {
		console.log('GET CHATS ERROR', err);
		res.status(500).send(`GET ERROR: ${err}`);
	}
};

module.exports = {
	getMyGangsTiles,
	getGangActivity,
};
