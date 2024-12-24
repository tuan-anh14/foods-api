const MenuItem = require('../models/menuItemModel');

const getMenuItemsByMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ menu: req.params.menuId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
};

module.exports = {
	getMenuItemsByMenu
};
