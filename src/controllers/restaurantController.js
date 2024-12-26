const Restaurant = require('../models//restaurantModel');
const asyncHandler = require('express-async-handler');
const Menu = require('../models/menuModel'); 
const MenuItem = require('../models/menuItemModel');

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

const topRatingRestaurants = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.body;

  const restaurants = await Restaurant.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(parseInt(limit, 10)); 

  if (!restaurants || restaurants.length === 0) {
    return res.status(404).json({ 
      success: false, 
      message: 'No top-rated restaurants found.' 
    });
  }

  res.status(200).json({
    success: true,
    message: 'Top Restaurant Rating 5*.',
    data: restaurants,
  });
});

const newCommerRestaurants = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.body; 

  const restaurants = await Restaurant.find({ isActive: true })
    .sort({ createdAt: -1 }) 
    .limit(parseInt(limit, 10));

  if (!restaurants || restaurants.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No new restaurants found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'List of newcomer restaurants.',
    data: restaurants,
  });
});

const topFreeshipRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true })
    .sort({ rating: -1 }); 

  if (!restaurants || restaurants.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No top freeship restaurants found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'List of top freeship restaurants.',
    data: restaurants,
  });
});

const fetchRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id)
    .populate({
      path: 'menus', 
      populate: {
        path: 'menuItems', 
      },
    });

  if (!restaurant) {
    return res.status(404).json({
      statusCode: 404,
      message: 'Restaurant not found.',
    });
  }

  res.status(200).json({
    statusCode: 200,
    message: 'Fetch a restaurant by id',
    data: restaurant,
  });
});

// Fetch a restaurant by ID  
const getRestaurantById = async (req, res) => {  
  try {  
    const restaurantId = req.params.id;  

    // Tìm nhà hàng theo ID  
    const restaurant = await Restaurant.findById(restaurantId);  
    if (!restaurant) {  
      return res.status(404).json({  
        statusCode: 404,  
        message: 'Restaurant not found',  
        data: null,  
      });  
    }  

    // Lấy danh sách menu của nhà hàng này  
    const menus = await Menu.find({ restaurant: restaurantId });  

    // Tạo một danh sách hứng chứa menuItem cho từng menu  
    const menuPromises = menus.map(async (menu) => {  
      const menuItems = await MenuItem.find({ menu: menu._id });  
      return {  
        _id: menu._id,  
        restaurant: menu.restaurant,  
        title: menu.title,  
        createdAt: menu.createdAt,  
        updatedAt: menu.updatedAt,  
        __v: 0, 
        menuItem: menuItems.map(item => ({  
          _id: item._id,  
          menu: item.menu,  
          title: item.title,  
          description: item.description || '',
          basePrice: item.basePrice,  
          image: item.image,  
          options: item.options,  
          createdAt: item.createdAt,  
          updatedAt: item.updatedAt,  
          __v: 0,  
        })),  
      };  
    });  

    // Chờ đợi tất cả promises trong menuPromises  
    const menuWithItems = await Promise.all(menuPromises);  

    // Chuyển đổi dữ liệu để phù hợp với định dạng yêu cầu  
    const responseData = {  
      _id: restaurant._id,  
      name: restaurant.name,  
      phone: restaurant.phone,  
      address: restaurant.address,  
      email: restaurant.email,  
      rating: restaurant.rating,  
      image: restaurant.image,  
      isActive: restaurant.isActive,  
      createdAt: restaurant.createdAt,  
      updatedAt: restaurant.updatedAt,  
      __v: 0, 
      menu: menuWithItems,  
    };  

    res.status(200).json({  
      statusCode: 200,  
      message: 'Fetch a restaurant by id',  
      data: responseData,  
    });  
  } catch (error) {  
    console.error(error);  
    res.status(500).json({  
      statusCode: 500,  
      message: 'An error occurred while fetching the restaurant',  
      data: null,  
    });  
  }  
};  

// Tìm kiếm nhà hàng theo tên với phân trang
const getRestaurantsByName = asyncHandler(async (req, res) => {
  const { current = 1, pageSize = 10, name = "" } = req.query;

  try {
    // Chuyển đổi current và pageSize sang số nguyên
    const currentPage = parseInt(current, 10);
    const size = parseInt(pageSize, 10);

    // Tạo regex tìm kiếm theo tên
    const nameRegex = new RegExp(name, 'i');

    // Tìm nhà hàng theo tên và phân trang
    const restaurants = await Restaurant.find({ name: { $regex: nameRegex } })
      .skip((currentPage - 1) * size)
      .limit(size);

    // Tổng số nhà hàng phù hợp
    const total = await Restaurant.countDocuments({ name: { $regex: nameRegex } });

    // Số trang tính toán
    const pages = Math.ceil(total / size);

    res.status(200).json({
      data: {
        meta: {
          current: currentPage,
          pageSize: size,
          pages,
          total,
        },
        results: restaurants,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'An error occurred while fetching restaurants',
    });
  }
});


module.exports = {
	getRestaurants,
  topRatingRestaurants,
  newCommerRestaurants,
  topFreeshipRestaurants,
  fetchRestaurantById,
  getRestaurantById,
  getRestaurantsByName
    
};