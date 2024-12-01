const User = require('../models/User');  
const bcrypt = require('bcryptjs');  

// Lấy danh sách người dùng  
exports.getUsers = async (req, res) => {  
    try {  
        const users = await User.find();  
        res.json(users);  
    } catch (error) {  
        res.status(500).json({ message: 'Server error' });  
    }  
};  

// Thêm người dùng  
exports.createUser = async (req, res) => {  
    const { name, email, password, phone } = req.body;  

    // Kiểm tra xem người dùng đã tồn tại  
    const existingUser = await User.findOne({ email });  
    if (existingUser) {  
        return res.status(400).json({ message: 'User already exists' });  
    }  

    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const user = new User({ name, email, password: hashedPassword, phone });  
        await user.save();  
        res.status(201).json(user);  
    } catch (error) {  
        res.status(500).json({ message: 'Server error' });  
    }  
};  

// Xóa người dùng  
exports.deleteUser = async (req, res) => {  
    const { id } = req.params;  
    try {  
        await User.findByIdAndDelete(id);  
        res.status(204).send();  
    } catch (error) {  
        res.status(500).json({ message: 'Server error' });  
    }  
};