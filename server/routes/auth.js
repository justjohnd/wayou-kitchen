const express = require('express');
const router = express.Router();

// Bring in register controller function
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth');

router.route("/register").post(register);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
//In forgotPassword, a resetToken will be created
router.route('/resetPassword/:resetToken').put(resetPassword);

module.exports = router;
