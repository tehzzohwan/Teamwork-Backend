const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authjwt');
const control = require('../controllers/teamwork.feed.controller.js');

router.get('/feed', [verifyToken], control.getFeed);

module.exports = router;