const Order = require('../models/Order');  

// Lấy danh sách Đơn Hàng  
exports.getOrders = async (req, res) => {  
    const orders = await Order.find().populate('user restaurant');  
    res.json(orders);  
};  

// Thêm Đơn Hàng  
exports.createOrder = async (req, res) => {  
    const { user, restaurant, totalPrice, totalQuantity, detail } = req.body;  
    const order = new Order({ user, restaurant, totalPrice, totalQuantity, detail });  
    await order.save();  
    res.status(201).json(order);  
};  

// Cập Nhật Trạng Thái Đơn Hàng  
exports.updateOrder = async (req, res) => {  
    const { id } = req.params;  
    const { status } = req.body;  
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });  
    res.json(order);  
};  

// Xóa Đơn Hàng  
exports.deleteOrder = async (req, res) => {  
    const { id } = req.params;  
    await Order.findByIdAndDelete(id);  
    res.status(204).send();  
};