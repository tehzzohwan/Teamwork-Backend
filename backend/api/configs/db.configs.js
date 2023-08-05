require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
	connectionString: process.env.DBConfigLink,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = db;
