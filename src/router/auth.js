const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');
const httpStatus = require('http-status');
const authenticateToken = require('../middleware/auth');

router.post('/register', async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

const passwordToHash = (password) => {
	return CryptoJS.HmacSHA256(
		password,
		CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()
	).toString();
};

const generateAccessToken = (user) => {
	return JWT.sign({ id: user._id }, process.env.PASSWORD_HASH, {
		expiresIn: '1w',
	});
};

const generateRefreshToken = (user) => {
	return JWT.sign({ id: user._id }, process.env.PASSWORD_HASH);
};

router.post('/login', async (req, res) => {
	console.log('req.body :>> ', req.body);
	try {
		User.findOne({ email: req.body.email }).then(async (user) => {
			if (!user)
				return res
					.status(httpStatus.NOT_FOUND)
					.send({ message: 'User not found!' });

			req.user = await User.findById(user._id);

			if (bcrypt.compareSync(req.body.password, user.password)) {
				res.send({
					access_token: generateAccessToken(user),
					refresh_token: generateRefreshToken(user),
				});
			}
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get('/me', authenticateToken, (req, res) => {
	res.json(req.user);
});

module.exports = router;
