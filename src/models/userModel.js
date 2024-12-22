/** @format */

const { default: mongoose, isValidObjectId, Schema } = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	photoUrl: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
	fcmTokens: {
		type: [String],
	},
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
