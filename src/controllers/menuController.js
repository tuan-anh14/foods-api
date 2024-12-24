const Menu = require('../models/menuModel');

const getMenusByRestaurant = async (req, res) => {
  try {
    const menus = await Menu.find({ restaurant: req.params.restaurantId });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error });
  }
};

const createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu', error });
  }
};

module.exports = {
	getMenusByRestaurant,
	createMenu
};
