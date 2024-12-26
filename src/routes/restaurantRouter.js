const Router = require('express');
const { getRestaurantsByName, topRatingRestaurants, topFreeshipRestaurants, newCommerRestaurants, getRestaurantById } = require('../controllers/restaurantController');

const restaurantRouter = Router();

restaurantRouter.get('/', getRestaurantsByName);
restaurantRouter.post('/top-rating', topRatingRestaurants);
restaurantRouter.post('/newcommer', newCommerRestaurants);
restaurantRouter.post('/top-freeship', topFreeshipRestaurants);
restaurantRouter.get('/:id', getRestaurantById);

module.exports = restaurantRouter;
