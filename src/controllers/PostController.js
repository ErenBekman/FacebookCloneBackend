const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const cloudinary = require('cloudinary').v2;

const index = async (req, res, next) => {
	try {
		const allPost = await Post.find({}).populate({
			path: 'userId',
			select: '_id username profilePicture followers followings isAdmin',
		});
		res.json(allPost);
	} catch (error) {
		next(error);
	}
};

const show = async (req, res) => {
	try {
		const result = await Post.findById(req.params.id).populate({
			path: 'userId',
			select: '_id username profilePicture followers followings isAdmin',
		});
		res.json(result);
	} catch (error) {
		next(error);
	}
};

const create = async (req, res, next) => {
	try {
		req.body.user_id = req.user;
		if (!req.files.img) {
			return res
				.status(httpStatus.BAD_REQUEST)
				.send({ message: 'image not found' });
		}
		const file = req.files.img;
		cloudinary.uploader.upload(
			file.tempFilePath,
			{ folder: 'facebook/posts' },
			function (err, result) {
				console.log('err :', err);
				console.log('result :', result);
				let posts = {
					img: result.url,
					...req.body,
				};

				const addPost = new Post(posts);
				const resultPost = addPost.save();
				res.json(resultPost);
			}
		);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const result = await Post.findByIdAndUpdate(
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
		const result = await Post.findByIdAndDelete({ _id: req.params.id });
		if (result) {
			return res.json({ msg: 'Post have deleted' });
		} else {
			// return res.status(404).json({msg: 'Post not found'})
			throw new Error('Post not found');
		}
	} catch (error) {
		next(error);
	}
};

const like = async (req, res, next) => {
	try {
		console.log('req.body :>> ', req.body);
		console.log('req.params :>> ', req.params);
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('The post has been liked');
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('The post has been disliked');
		}
	} catch (error) {
		next(error);
	}
};

const timeline = async (req, res, next) => {
	try {
		console.log('req.body :>> ', req.body);
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (error) {
		next(error);
	}
};

module.exports = {
	index,
	show,
	create,
	update,
	destroy,
	like,
	timeline,
};
