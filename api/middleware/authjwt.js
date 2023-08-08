const jwt = require('jsonwebtoken');
const db = require('../configs/db.configs');
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) {
		return res.status(403).send({
			'status': 'Error',
			'error': 'Unauthorized',    
		});
	}

	jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				'status': 'Error',
				'error': err.message,
			});
		}
		req.role = decoded.role;
		req.user_id = decoded.user_id;
		next();
	});
};

const isAdmin = async (req, res, next) => {
	const role = req.role;
	const findUser = await db.query('SELECT * FROM users WHERE role = $1', [role]);
	if (findUser.rows[0].role === 'admin' ) {
		next();
	} else {
		return res.status(403).send({
			'status': 'Error',
			'error': 'Require Admin Role!'
		});
	}
};

module.exports = {
	verifyToken,
	isAdmin
};
