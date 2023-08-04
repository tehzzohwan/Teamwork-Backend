const db = require('../configs/db.configs');

const getFeed = async (req, res) => {
	try {
		const getGifs = await db.query('SELECT * FROM gif ORDER BY created_on DESC');
		const getArticles = await db.query('SELECT * FROM article ORDER BY created_on DESC');
		const result = [...getGifs.rows, ...getArticles.rows];
		const finalResult = result.sort((p1, p2) => (p1.created_on < p2.created_on) ? 1 : (p1.created_on > p2.created_on) ? -1 : 0);
		res.status(200).json({
			'status': 'success',
			'data': finalResult
		});
	} catch (err) {
		res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

exports.getFeed = getFeed;
