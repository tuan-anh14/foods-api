const mongoose = require('mongoose');  

const orderSchema = new mongoose.Schema({  
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },  
    totalPrice: { type: Number, required: true },  
    totalQuantity: { type: Number, required: true },  
    detail: [{  
        title: { type: String, required: true },  
        price: { type: Number, required: true },  
        quantity: { type: Number, required: true },  
        image: { type: String },   
        options: [{ type: String }]   
    }],  
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },  
    createdAt: { type: Date, default: Date.now },  
    updatedAt: { type: Date, default: Date.now }  
});  

module.exports = mongoose.model('Order', orderSchema);