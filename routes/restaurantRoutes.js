const express = require('express');  
const { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');  
const { authMiddleware } = require('../middleware/authMiddleware');  

const router = express.Router();  

router.get('/', authMiddleware, getRestaurants);  
router.post('/', authMiddleware, createRestaurant);  
router.patch('/:id', authMiddleware, updateRestaurant);  
router.delete('/:id', authMiddleware, deleteRestaurant);  

module.exports = router;