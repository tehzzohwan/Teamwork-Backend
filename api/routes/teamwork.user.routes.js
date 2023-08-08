const express = require('express');
const router = express.Router();
const control = require('../controllers/teamwork.user.controller');
const { verifyToken, isAdmin } = require('../middleware/authjwt');
const {checkDuplicateEmail, checkValidEmail} = require('../middleware/verifyCreateUser');

router.get('/users', [verifyToken, isAdmin], control.getUsers);

router.post('/users', [verifyToken, isAdmin, checkDuplicateEmail, checkValidEmail], control.createUser);

router.post('/auth/login', control.loginUser);

module.exports = router;
