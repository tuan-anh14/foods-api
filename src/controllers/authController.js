/** @format */

const UserModel = require('../models/userModel');
const bcryp = require('bcrypt');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const getJsonWebToken = async (email, id) => {
	const payload = {
		email,
		id,
	};
	const token = jwt.sign(payload, process.env.SECRET_KEY, {
		expiresIn: '7d',
	});

	return token;
};

const handleSendMail = async (val) => {
	try {
		await transporter.sendMail(val);

		return 'OK';
	} catch (error) {
		return error;
	}
};

const verification = asyncHandle(async (req, res) => {
	const { email } = req.body;

	const verificationCode = Math.round(100000 + Math.random() * 9000);

	try {
		const data = {
			from: `"Food App" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: 'Your Verification Code - Food App',
			text: 'Your code to verify your email',
			html: `
			  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
				<div style="text-align: center; padding-bottom: 20px;">
				  <h1 style="color: #4CAF50;">🍽️ Welcome to Food App!</h1>
				</div>
				<div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
				  <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
					Thank you for registering with <strong>Food App</strong>. To complete your registration, please use the verification code below:
				  </p>
				  <div style="margin: 20px 0; text-align: center;">
					<span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #fff; background-color: #4CAF50; border-radius: 8px;">
					  ${verificationCode}
					</span>
				  </div>
				  <p style="font-size: 14px; color: #555; text-align: center;">
					This code is valid for the next 10 minutes. If you didn’t request this email, you can safely ignore it.
				  </p>
				</div>
				<div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
				  <p>© ${new Date().getFullYear()} Food App. All rights reserved.</p>
				</div>
			  </div>
			`,
		  };
		  

		await handleSendMail(data);

		res.status(200).json({
			message: 'Send verification code successfully!!!',
			data: {
				code: verificationCode,
			},
		});
	} catch (error) {
		res.status(401);
		throw new Error('Can not send email');
	}
});

const register = asyncHandle(async (req, res) => {
	const { email, name, password } = req.body;

	const existingUser = await UserModel.findOne({ email });

	if (existingUser) {
		res.status(400).json({
			message: 'Email đã tồn tại. Vui lòng sử dụng email khác !'
		});;
		throw new Error('User has already exist!!!');
	}

	const salt = await bcryp.genSalt(10);
	const hashedPassword = await bcryp.hash(password, salt);

	const newUser = new UserModel({
		email,
		name,
		password: hashedPassword,
	});

	await newUser.save();

	res.status(200).json({
		message: 'Register new user successfully',
		data: {
			email: newUser.email,
			id: newUser._id,
			accesstoken: await getJsonWebToken(email, newUser.id),
		},
	});
});

const login = asyncHandle(async (req, res) => {
    const { email, password } = req.body;

    // Thêm Delay từ Header
    const delay = req.headers['delay'];
    if (delay) {
        await new Promise(resolve => setTimeout(resolve, parseInt(delay, 10)));
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
        res.status(403);
        throw new Error('User not found!!!');
    }

    // Kiểm tra trạng thái tài khoản
    // if (!existingUser.isActive) {
    //     res.status(403);
    //     throw new Error('Account is not active. Please verify your email or contact support!');
    // }

    const isMatchPassword = await bcryp.compare(password, existingUser.password);

    if (!isMatchPassword) {
        res.status(401);
        throw new Error('Email or Password is not correct!');
    }

    // Lưu lịch sử đăng nhập
    const loginHistory = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
    };

    existingUser.loginHistory = existingUser.loginHistory || [];
    existingUser.loginHistory.push(loginHistory);

    await existingUser.save();


    res.status(200).json({
        message: 'Login successfully',
        data: {
            id: existingUser.id,
            email: existingUser.email,
            accesstoken: await getJsonWebToken(email, existingUser.id),
            fcmTokens: existingUser.fcmTokens ?? [],
            photo: existingUser.photoUrl ?? '',
            name: existingUser.name ?? '',
        },
    });
});


const forgotPassword = asyncHandle(async (req, res) => {
	const { email } = req.body;

	const randomPassword = Math.round(100000 + Math.random() * 99000);

	const data = {
		from: `"New Password" <${process.env.USERNAME_EMAIL}>`,
		to: email,
		subject: 'Verification email code',
		text: 'Your code to verification email',
		html: `<h1>${randomPassword}</h1>`,
	};

	const user = await UserModel.findOne({ email });
	if (user) {
		const salt = await bcryp.genSalt(10);
		const hashedPassword = await bcryp.hash(`${randomPassword}`, salt);

		await UserModel.findByIdAndUpdate(user._id, {
			password: hashedPassword,
			isChangePassword: true,
		})
			.then(() => {
				console.log('Done');
			})
			.catch((error) => console.log(error));

		await handleSendMail(data)
			.then(() => {
				res.status(200).json({
					message: 'Send email new password successfully!!!',
					data: [],
				});
			})
			.catch((error) => {
				res.status(401);
				throw new Error('Can not send email');
			});
	} else {
		res.status(401);
		throw new Error('User not found!!!');
	}
});

const handleLoginWithGoogle = asyncHandle(async (req, res) => {
	const userInfo = req.body;

	const existingUser = await UserModel.findOne({ email: userInfo.email });
	let user;
	if (existingUser) {
		await UserModel.findByIdAndUpdate(existingUser.id, {
			updatedAt: Date.now(),
		});
		user = { ...existingUser };
		user.accesstoken = await getJsonWebToken(userInfo.email, userInfo.id);

		if (user) {
			const data = {
				accesstoken: user.accesstoken,
				id: existingUser._id,
				email: existingUser.email,
				fcmTokens: existingUser.fcmTokens,
				photo: existingUser.photoUrl,
				name: existingUser.name,
			};

			res.status(200).json({
				message: 'Login with google successfully!!!',
				data,
			});
		} else {
			res.sendStatus(401);
			throw new Error('fafsf');
		}
	} else {
		const newUser = new UserModel({
			email: userInfo.email,
			fullname: userInfo.name,
			...userInfo,
		});
		await newUser.save();
		user = { ...newUser };
		user.accesstoken = await getJsonWebToken(userInfo.email, newUser.id);

		if (user) {
			res.status(200).json({
				message: 'Login with google successfully!!!',
				data: {
					accesstoken: user.accesstoken,
					id: user._id,
					email: user.email,
					fcmTokens: user.fcmTokens,
					photo: user.photoUrl,
					name: user.name,
				},
			});
		} else {
			res.sendStatus(401);
			throw new Error('fafsf');
		}
	}
});

module.exports = {
	register,
	login,
	verification,
	forgotPassword,
	handleLoginWithGoogle,
};
