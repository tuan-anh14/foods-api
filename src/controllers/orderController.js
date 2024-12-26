const Order = require('../models/orderModel');   
const Restaurant = require('../models/restaurantModel');   
const asyncHandler = require('express-async-handler');  

// API: Đặt hàng  
const placeAnOrder = asyncHandler(async (req, res) => {  
  const { restaurant, totalPrice, totalQuantity, detail } = req.body;  
  const userId = req.user.id; // Lấy userId từ middleware xác thực  

  // Kiểm tra xem nhà hàng có tồn tại hay không  
  const existingRestaurant = await Restaurant.findById(restaurant);  
  if (!existingRestaurant) {  
    return res.status(404).json({  
      statusCode: 404,  
      message: 'Không tìm thấy nhà hàng',  
      timestamp: Date.now(),  
    });  
  }  

  // Tạo đơn hàng mới và liên kết với userId  
  const newOrder = new Order({  
    restaurant,  
    user: userId, // Gán đơn hàng cho người dùng  
    totalPrice,  
    totalQuantity,  
    detail,  
  });  

  const savedOrder = await newOrder.save();  

  res.status(201).json({  
    statusCode: 201,  
    message: 'Đơn hàng đã được tạo thành công',  
    data: { _id: savedOrder._id },  
    timestamp: Date.now(),  
  });  
});  

// API: Lấy tất cả đơn hàng của người dùng đã xác thực  
const getAllOrders = asyncHandler(async (req, res) => {  
  const userId = req.user.id; // Lấy userId từ middleware xác thực  

  try {  
    // Lấy tất cả đơn hàng liên kết với user  
    const orders = await Order.find({ user: userId }) // Lọc theo userId  
      .populate('restaurant')   
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo giảm dần  

    res.status(200).json({  
      statusCode: 200,  
      message: 'Đã lấy tất cả đơn hàng thành công',  
      data: orders,  
      timestamp: Date.now(),  
    });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({  
      statusCode: 500,  
      message: 'Lỗi nội bộ',  
      timestamp: Date.now(),  
    });  
  }  
});  

module.exports = { placeAnOrder, getAllOrders };