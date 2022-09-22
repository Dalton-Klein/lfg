require('dotenv').config();
const db = require('../models/index');
const appName = 'gangs.gg';
const supportEmail = 'deklein@live.com';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'hotmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

exports.keyGen = (length) => {
	let key = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		key += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return key;
};

exports.checkToken = async (id, token) => {
	let check = await db.userTokens.findOne({ where: { id: id } });
	check = check.dataValues;
	let result = '';
	if (check.id) {
		if (check.token === token) {
			result = true;
		} else result = false;
	} else result = false;
	return result;
};

exports.sendEmail = async (req, vKey, subject, username = '') => {
	if (username != '') {
		username = ' ' + username;
	}
	const emailSubjects = {
		1: `${appName} sign up verification`,
		2: `${appName} password reset verification`,
	};
	const emailBodys = {
		1: `Hello${username}, \n\nThank you for joining ${appName}! Your verification code is: \n\n${vKey} \n\nHappy gaming!`,
		2: `Hello${username}, \n\nA request to change the password for your ${appName} account has been received. \n\nIf this was you, use this code to complete your request: ${vKey} \n\nIf you did not make this request, please contact us at ${supportEmail}. \n\nThank you, \n${appName}`,
	};
	const data = {
		from: `${appName} <${process.env.EMAIL}>`,
		to: `${req.body.email}`,
		subject: `${emailSubjects[subject]}`,
		text: `${emailBodys[subject]}`,
	};
	transporter.sendMail(data, (err, info) => {
		if (err) {
			console.log('error sending email: ', err);
			return;
		} else {
			console.log('email sent: ', info.response);
			return;
		}
	});
};
