const { Router } = require('express');
const { likeRestaurant, getLikedRestaurants,deleteLike } = require('../controllers/likeController');
const verifyToken = require('../middleware/authMiddleware');

const likeRouter = Router();

likeRouter.post('/',verifyToken, likeRestaurant);
likeRouter.post('/delete',verifyToken, deleteLike);
likeRouter.get('/',verifyToken, getLikedRestaurants);
module.exports = likeRouter;
