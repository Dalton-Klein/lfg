const { sequelize } = require('../models/index');
const Sequelize = require('sequelize');
const {
	removeEndorsementQuery,
	createEndorsementQuery,
	getEndorsementsBetweenUsersQuery,
	getEndorsementOptionsQuery,
} = require('../services/endorsement-queries');
const { saveNotification } = require('./notification-controller');

const addOrRemoveEndorsement = async (req, res) => {
	const { typeId, senderId, receiverId, value } = req.body;
	try {
		//First, clean up similar endorsements
		const query = removeEndorsementQuery();
		const removeResult = await sequelize.query(query, {
			type: Sequelize.QueryTypes.DELETE,
			replacements: {
				typeId,
				senderId,
				receiverId,
			},
		});
		//Second, insert endorsement into endorsements table as long as value isn't neutral (0)
		if (value !== 0) {
			const query = createEndorsementQuery();
			await sequelize.query(query, {
				type: Sequelize.QueryTypes.INSERT,
				replacements: {
					typeId,
					senderId,
					receiverId,
					value,
				},
			});
		}
		//Third, send receiver a notification
		await saveNotification(receiverId, 5, senderId);
		//Finally, return result
		res.status(200).send(removeResult ? { status: 'success' } : { status: 'error' });
	} catch (err) {
		console.log(err);
	}
};

const getEndorsementOptions = async (req, res) => {
	const { inputterId, receiverId, rust_is_published } = req.body;
	try {
		//First, get list of platform ids to consider
		const platformIdsToConsider = [0];
		if (rust_is_published) platformIdsToConsider.push(1);
		//Next, get list of endorsement options based on platform list
		let query = getEndorsementOptionsQuery();
		const endorsementOptions = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				platformIdsToConsider,
			},
		});
		//Next, get list of existing endorsements sent by inputter to the receiver
		query = getEndorsementsBetweenUsersQuery();
		const existingEndorsements = await sequelize.query(query, {
			type: Sequelize.QueryTypes.SELECT,
			replacements: {
				receiverId,
				inputterId,
			},
		});
		//Next, modify options to include property indicating if endorsement has previously been sent for that option
		endorsementOptions.forEach((option) => {
			existingEndorsements.forEach((endorsement) => {
				if (option.id === endorsement.type_id) {
					option.already_endorsed = endorsement.value;
				}
			});
			if (!option.already_endorsed) option.already_endorsed = 0;
		});
		//Finally, return result
		res.status(200).send(endorsementOptions ? { status: 'success', data: endorsementOptions } : { status: 'error' });
	} catch (err) {
		console.log(err);
	}
};

module.exports = { addOrRemoveEndorsement, getEndorsementOptions };
