require ('dotenv').config();
const cloudinary = require( 'cloudinary').v2;

const db = require('../configs/db.configs');

const createGifsTable = async () => {
	await db.query('DROP TABLE IF EXISTS gif');
	await db.query(`CREATE TABLE IF NOT EXISTS gif (id SERIAL PRIMARY KEY, 
      title VARCHAR(200) NOT NULL, 
      image VARCHAR(2000) NOT NULL, 
      created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_id INT NOT NULL
     )`);

	await db.query('INSERT INTO gif (title, image, user_id) VALUES ($1, $2, $3) RETURNING *', ['No time', 'https://printivo.com/blog/wp-content/uploads/2022/01/Sticker.png', 0o0] );
};

createGifsTable();

const createGif = async (req, res) => {
	const  { title, image } = req.body;
	const user_id = parseInt(req.user_id, 10);

	try {
		const cloudinaryImage =await cloudinary.uploader
			.upload(image)
			.then(result=> {
				if (result.url) {
					return result.url;
				} else {
					console.error('Upload failed');
				}
			});
		const insertGif = await db.query('INSERT INTO gif ( title, image, user_id ) VALUES ($1, $2, $3) RETURNING *', [title, cloudinaryImage, user_id]);
		if (insertGif.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'gif_id': insertGif.rows[0].id,
					'message': 'Gif image successfully posted',
					'created_on': insertGif.rows[0].created_on,
					'title': insertGif.rows[0].title,
					'image_url': insertGif.rows[0].image
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

const deleteGifById = async (req, res) => {
	const gifId = parseInt(req.params.gifId, 10);
	const user_id = parseInt(req.user_id, 10);

	try{
		const deleteGif = await db.query('DELETE FROM gif WHERE id = $1 AND user_id = $2 RETURNING *', [ gifId, user_id ]);
		if (deleteGif.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': {
					'message': 'Gif successfully deleted',
				} 
			});
		} else {
			return res.status(400).json({
				'status': 'error',
				'error': 'cannot find gif resource'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const getAllGifs = async (req, res) => {
	try {
		const getGifs = await db.query('SELECT * FROM gif ORDER BY id ASC');
		if (getGifs.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getGifs.rows
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'cannot find gifs'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		}); 
	}
};

const getAllGifsById = async (req, res) => {
	const user_id = parseInt(req.user_id, 10);

	try {
		const getGifs = await db.query('SELECT * FROM gif WHERE user_id = $1 ORDER BY id ASC', [ user_id ]);
		if (getGifs.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getGifs.rows
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'Can\'t find gifs'
			});
		}
	} catch (err) {
		return res.status(500).json({
			'status': 'error',
			'error': err.message
		});
	}
};

const getGifById = async (req, res) => {
	const gifId = parseInt(req.params.gifId, 10);

	try {
		const getGif = await db.query('SELECT * FROM gif WHERE id = $1', [gifId]);
		if (getGif.rows.length > 0) {
			return res.status(200).json({
				'status': 'success',
				'data': getGif.rows[0]
			});
		} else {
			return res.status(404).json({
				'status': 'error',
				'error': 'Can\'t find gif'
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
	createGif,
	deleteGifById,
	getAllGifs,
	getAllGifsById,
	getGifById
};
