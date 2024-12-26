const { Router } = require('express');
const { likeRestaurant, getLikedRestaurants } = require('../controllers/likeController');
const verifyToken = require('../middleware/authMiddleware');

const likeRouter = Router();

likeRouter.post('/',verifyToken, likeRestaurant);
likeRouter.get('/',verifyToken, getLikedRestaurants);
module.exports = likeRouter;
