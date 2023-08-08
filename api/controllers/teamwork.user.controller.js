const db = require('../configs/db.configs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.SECRET;

const testPostgres = async () => {
	const result = await db.query('SELECT $1::text as name', ['db connected']);
	console.log(result.rows[0].name);
};

testPostgres();

const createDummyUsers = async () => {
	await db.query('DROP TABLE IF EXISTS users');
	await db.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, 
      role VARCHAR(20) NOT NULL, 
      first_name VARCHAR(50) NOT NULL, 
      last_name VARCHAR(50) NOT NULL, 
      email VARCHAR(100) UNIQUE NOT NULL, 
      password VARCHAR(200) NOT NULL, 
      gender VARCHAR(20) NOT NULL, 
      job_role VARCHAR(20) NOT NULL, 
      department VARCHAR(50) NOT NULL, 
      address VARCHAR(250) NOT NULL)`);

	const temsHashedPassword = await bcrypt.hash('test', saltRounds);
	const ayraHashedPassword = await bcrypt.hash('testing', saltRounds);


	await db.query(`INSERT INTO users (role, first_name, last_name, email, password, gender, job_role, department, address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
	['admin', 'Tems', 'Wendy', 'tems@example.com', temsHashedPassword, 'female', 'manager', 'human_resourses', '2, oyinbo street']);

	await db.query(`INSERT INTO users (role, first_name, last_name, email, password, gender, job_role, department, address) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  RETURNING *`,
	['employee', 'Ayra', 'Star', 'ayra@example.com', ayraHashedPassword, 'male', 'influencer', 'marketing', '55, alagbon street']);
};

createDummyUsers();

const getUsers = async (req, res) => {
	try {
		const users = await db.query('SELECT * FROM users ORDER BY id ASC ');
		return res.status(200).json({
			'status': 'success',
			'data': users.rows
		});
	} catch (err) {
		return res.status(400).send({
			'status': 'error',
			'error': err.message
		});
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const checkDbForUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
		if (checkDbForUser.rows.length > 0) {
			const hashedPassword = checkDbForUser.rows[0].password;
			const comparePassword = bcrypt.compareSync(password, hashedPassword);
			if (comparePassword) {
				const token = jwt.sign({ 
					role: checkDbForUser.rows[0].role, 
					user_id: checkDbForUser.rows[0].id
				},
				secret,
				{
					algorithm: 'HS256',
					allowInsecureKeySizes: true,
					expiresIn: 86400, // 24 hours
				});
				return res.status(200).send({
					'status': 'success',
					'data': {
						'first_name': checkDbForUser.rows[0].first_name,
						'last_name': checkDbForUser.rows[0].last_name,
						'email': checkDbForUser.rows[0].email,
						'token': token,
						'role': checkDbForUser.rows[0].role
					}
				});
			} else {
				return res.status(404).send({
					'status': 'error',
					'error': 'check your credentials'
				});
			}
		} else {
			return res.status(404).send({
				'status': 'error',
				'error': 'check your credentials'
			});
		}
	} catch (err) {
		return res.status(500).send({
			'status': 'error',
			'error': err.message
		});
	}
};

const createUser = async (req, res) => {
	const { first_name, role, last_name, email, password, gender, job_role, department, address } = req.body;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	try {
		const insertUser = await db.query(`INSERT INTO users (role, first_name, last_name, email, password, gender, job_role, department, address) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
		[role, first_name, last_name, email, hashedPassword, gender, job_role, department, address]);
		if (insertUser.rows[0]) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'message': 'User account successfully created',
					'user_id': insertUser.rows[0].id,
					'first_name': insertUser.rows[0].first_name,
					'last_name': insertUser.rows[0].last_name,
					'email': insertUser.rows[0].email,
				}
			});
		}
	} catch (err) {
		return res.status(500).send({
			'status': 'error',
			'error': err.message
		});
	}
};

module.exports = {
	getUsers,
	createUser,
	loginUser
};
