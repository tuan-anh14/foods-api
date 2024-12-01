const mongoose = require('mongoose');  

const restaurantSchema = new mongoose.Schema({  
    name: { type: String, required: true },  
    phone: { type: String, required: true },  
    address: { type: String, required: true },  
    email: { type: String, required: true, unique: true },  
    image: { type: String },   
    isActive: { type: Boolean, default: true },  
    createdAt: { type: Date, default: Date.now },  
    updatedAt: { type: Date, default: Date.now }  
});  

module.exports = mongoose.model('Restaurant', restaurantSchema);