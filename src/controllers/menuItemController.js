const MenuItem = require('../models/menuItemModel');

exports.getMenuItemsByMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ menu: req.params.menuId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu item', error });
  }
};
