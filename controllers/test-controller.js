const emailService = require('../services/auth');

const testEmails = async (req, res) => {
	try {
		await emailService.sendEmail({ body: { email: 'kultured@outlook.com' } }, 'vKey', 5, 'dalton k');
		res.status(200).send('done');
	} catch (error) {
		console.log('test route error: ', error);
	}
};

module.exports = { testEmails };
