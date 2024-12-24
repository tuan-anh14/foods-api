const Restaurant = require('../models//restaurantModel');

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: 'Error creating restaurant', error });
  }
};
