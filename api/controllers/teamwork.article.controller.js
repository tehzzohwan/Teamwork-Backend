const db = require('../configs/db.configs');

const createArticlesTable = async () => {
	await db.query('DROP TABLE IF EXISTS article');
	await db.query(`CREATE TABLE IF NOT EXISTS article (id SERIAL PRIMARY KEY, 
      title VARCHAR(200) NOT NULL, 
      article VARCHAR(2000) NOT NULL, 
      created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      category VARCHAR(100) NOT NULL,
      user_id INT NOT NULL
     )`);
	await db.query('INSERT INTO article (title, article, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *', ['This time', 'lorem ipsus dolor sit amet consectetur adipiscing el aspect', 'sport', 0o0]);
};

createArticlesTable();

const createArticle = async (req, res) => {
	const  { title, article, category, } = req.body;
	const user_id = parseInt(req.user_id, 10);
    
	try {
		const insertArticle = await db.query('INSERT INTO article (title, article, category, user_id ) VALUES ($1, $2, $3, $4) RETURNING *', [title, article, category, user_id]);
		if (insertArticle.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'message': 'Article successfully posted',
					'article_id': insertArticle.rows[0].id,
					'created_on': insertArticle.rows[0].created_on,
					'title': insertArticle.rows[0].title,
					'category': insertArticle.rows[0].category
				}
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'Failed! Please try again'
			});
		}
	} catch (err) {
		return res.status(400).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const patchArticleById = async (req, res) => {
	const articleId = parseInt(req.params.articleId, 10);
	const { article, title, category } = req.body;
	const user_id = req.user_id;

	try {
		const modifyArticle = await db.query('UPDATE article SET title = $1, article = $2, category = $3 WHERE id = $4 AND user_id = $5 RETURNING *', 
			[ title, article, category, articleId, user_id ]);
		if (modifyArticle.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'message': 'Article successfully updated',
					'article': modifyArticle.rows[0].article,
					'title': modifyArticle.rows[0].title,
					'category': modifyArticle.rows[0].category
				}
			});
		} else {
			return res.status(400).json({
				'status': 'error',
				'error': 'cannot find article'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const deleteArticleById = async (req, res) => {
	const articleId = parseInt(req.params.articleId, 10);
	const user_id = req.user_id;

	try{
		const deleteArticle = await db.query('DELETE FROM article WHERE id = $1 AND user_id = $2 RETURNING *', [ articleId, user_id ]);
		if (deleteArticle.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'message': 'Article successfully deleted',
				} 
			});
		} else {
			return res.status(400).json({
				'status': 'error',
				'error': 'cannot find article'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const getAllArticlesById = async (req, res) => {
	const user_id = req.user_id;

	try {
		const getArticles = await db.query('SELECT * FROM article WHERE user_id = $1 ORDER BY id ASC', [ user_id ]);
		if (getArticles.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getArticles.rows
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'cannot find articles'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const getAllArticles = async (req, res) => {
	try {
		const getArticles = await db.query('SELECT * FROM article ORDER BY id ASC');
		if (getArticles.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getArticles.rows
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'cannot find articles'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const getArticleById = async (req, res) => {
	const articleId = parseInt(req.params.articleId, 10);

	try {
		const getArticle = await db.query('SELECT * FROM article WHERE id = $1', [articleId]);
		if (getArticle.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getArticle.rows[0]
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'cannot find article'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

module.exports = {
	createArticle,
	patchArticleById,
	deleteArticleById,
	getAllArticles,
	getAllArticlesById,
	getArticleById
};

