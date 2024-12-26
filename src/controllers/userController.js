const asyncHandle = require('express-async-handler');
const UserModel = require('../models/userModel');

const updateProfile = asyncHandle(async (req, res) => {
    const { id, name, email, phone, address, photo } = req.body; // Nhận dữ liệu từ body

    // Kiểm tra nếu không có id hoặc dữ liệu cần cập nhật
    if (!id) {
        return res.status(400).json({
            message: 'User ID is required to update information!',
        });
    }

    // Tìm người dùng theo ID
    const user = await UserModel.findById(id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found!',
        });
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { name, email, phone, address, photo },
        { new: true }
    );

    res.status(200).json({
        message: 'User profile updated successfully!',
        data: updatedUser,
    });
});

module.exports = { updateProfile };
