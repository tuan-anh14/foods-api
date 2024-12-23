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
		unique: true, // Đảm bảo email là duy nhất
	},
	password: {
		type: String,
		require: true,
	},
	photoUrl: {
		type: String,
	},
	isVerified: { 
		type: Boolean, 
		default: false 
	},
	verificationCode: { 
		type: Number, 
		default: null 
	}, // Mã xác thực
	verificationExpires: { 
		type: Date, 
		default: null 
	}, // Thời gian hết hạn mã
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
