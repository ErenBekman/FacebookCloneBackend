const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: true,
			min: 3,
			max: 20,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		profilePicture: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			max: 500,
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		city: {
			type: String,
			max: 50,
		},
		relationship: {
			type: Number,
			enum: [1, 2, 3],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
