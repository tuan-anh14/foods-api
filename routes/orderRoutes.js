const express = require('express');  
const { getOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');  
const { authMiddleware } = require('../middleware/authMiddleware');  

const router = express.Router();  

router.get('/', authMiddleware, getOrders);  
router.post('/', authMiddleware, createOrder);  
router.patch('/:id', authMiddleware, updateOrder);  
router.delete('/:id', authMiddleware, deleteOrder);  

module.exports = router;