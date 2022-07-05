const User = require('../models/User');
const bcrypt = require('bcrypt');

const index = async (req, res, next) => {
	try {
		const allUser = await User.find({});
		res.json(allUser);
	} catch (error) {
		next(error);
	}
};

const show = async (req, res) => {
	try {
		const result = await User.find({ _id: req.params.id });
		res.json(result);
	} catch (error) {
		next(error);
	}
};

const create = async (req, res, next) => {
	try {
		const addUser = new User(req.body);
		const result = await addUser.save();
		res.json(result);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await User.findByIdAndUpdate(
			{ _id: req.params.id },
			req.body,
			{ new: true }
		);
		res.json(result);
	} catch (error) {
		next(error);
	}
};

const destroy = async (req, res, next) => {
	try {
		const result = await User.findByIdAndDelete({ _id: req.params.id });
		if (result) {
			return res.json({ msg: 'user have deleted' });
		} else {
			return res.status(404).json({ msg: 'user not found' });
			// throw new Error('user not found');
		}
	} catch (error) {
		next(error);
	}
};

const follow = async (req, res, next) => {
	try {
		if (req.body.userId !== req.params.id) {
			try {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.body.userId);
				if (!user.followers.includes(req.body.userId)) {
					await user.updateOne({ $push: { followers: req.body.userId } });
					await currentUser.updateOne({ $push: { followings: req.params.id } });
					res.status(200).json('user has been followed');
				} else {
					res.status(403).json('you allready follow this user');
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(403).json('you cant follow yourself');
		}
	} catch (error) {
		next(error);
	}
};

const unfollow = async (req, res, next) => {
	try {
		if (req.body.userId !== req.params.id) {
			try {
				const user = await User.findById(req.params.id);
				const currentUser = await User.findById(req.body.userId);
				if (user.followers.includes(req.body.userId)) {
					await user.updateOne({ $pull: { followers: req.body.userId } });
					await currentUser.updateOne({ $pull: { followings: req.params.id } });
					res.status(200).json('user has been unfollowed');
				} else {
					res.status(403).json('you dont follow this user');
				}
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(403).json('you cant unfollow yourself');
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { index, show, create, update, destroy, follow, unfollow };
