require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
	connectionString: process.env.DBConnLink,
	ssl: true
});

module.exports = db;
