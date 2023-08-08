const db = require('../configs/db.configs');

const checkDuplicateEmail = async (req, res, next) => {
	const { email } = req.body;
	const userEmail = await db.query('SELECT * FROM users WHERE email = $1', [email]);
	if (userEmail.rows.length === 0) {
		next();
	} else {
		return res.status(400).send({
			'status': 'Error',
			'error': 'Failed! email already in use'
		});
	}

};

const checkValidEmail = async (req, res, next) => {
	const { email } = req.body;
	var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (email.match(validRegex)) {
		next();
	} else {
		return res.status(400).send({
			'status': 'Error',
			'error': 'Failed! email address is invalid'
		});
	}
};

module.exports = {
	checkDuplicateEmail,
	checkValidEmail
};