const Restaurant = require('../models/Restaurant');  

// Lấy danh sách Nhà Hàng  
exports.getRestaurants = async (req, res) => {  
    const restaurants = await Restaurant.find();  
    res.json(restaurants);  
};  

// Thêm Nhà Hàng  
exports.createRestaurant = async (req, res) => {  
    const { name, phone, address, email, image } = req.body;  
    const restaurant = new Restaurant({ name, phone, address, email, image });  
    await restaurant.save();  
    res.status(201).json(restaurant);  
};  

// Cập Nhật Nhà Hàng  
exports.updateRestaurant = async (req, res) => {  
    const { id } = req.params;  
    const { name, phone, address, email, image } = req.body;  
    const restaurant = await Restaurant.findByIdAndUpdate(id, { name, phone, address, email, image }, { new: true });  
    res.json(restaurant);  
};  

// Xóa Nhà Hàng  
exports.deleteRestaurant = async (req, res) => {  
    const { id } = req.params;  
    await Restaurant.findByIdAndDelete(id);  
    res.status(204).send();  
};