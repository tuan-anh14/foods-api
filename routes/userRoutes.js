const express = require('express');  
const { getUsers, createUser, deleteUser } = require('../controllers/userController');  
const { authMiddleware } = require('../middleware/authMiddleware');  

const router = express.Router();  

// Route để lấy danh sách người dùng  
router.get('/', authMiddleware, getUsers);  

// Route để tạo người dùng mới  
router.post('/', authMiddleware, createUser);  

// Route để xóa người dùng  
router.delete('/:id', authMiddleware, deleteUser);  

module.exports = router;