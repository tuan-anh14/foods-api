const User = require('../models/User');  
const jwt = require('jsonwebtoken');  
const bcrypt = require('bcryptjs');  

// Đăng Ký Người Dùng  
exports.register = async (req, res) => {  
    const { name, email, password } = req.body;  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const user = new User({ name, email, password: hashedPassword });  
        await user.save();  
        res.status(201).json({ message: 'User created successfully.' });  
    } catch (error) {  
        res.status(400).json({ message: error.message });  
    }  
};  

// Đăng Nhập Người Dùng  
exports.login = async (req, res) => {  
    const { email, password } = req.body;  
    const user = await User.findOne({ email });  

    if (!user || !(await bcrypt.compare(password, user.password))) {  
        return res.status(401).json({ message: 'Invalid credentials' });  
    }  

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });  
    res.json({ token });  
};