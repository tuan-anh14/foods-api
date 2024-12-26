
const Order = require('../models/orderModel'); 
const Restaurant = require('../models/restaurantModel'); 

const placeAnOrder = async (req, res) => {
  try {
    const { restaurant, totalPrice, totalQuantity, detail } = req.body;

    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Restaurant not found',
        timestamp: Date.now(),
      });
    }

    const newOrder = new Order({
      restaurant,
      totalPrice,
      totalQuantity,
      detail,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      statusCode: 201,
      message: 'Create an order',
      data: { _id: savedOrder._id },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: Date.now(),
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('restaurant') 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      statusCode: 200,
      message: 'Fetched all orders successfully',
      data: orders,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp: Date.now(),
    });
  }
};

module.exports = {placeAnOrder, getAllOrders};
