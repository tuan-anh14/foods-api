const express = require('express');  
const cors = require('cors');  
const connectDB = require('./config/db');  
const authRoutes = require('./routes/authRoutes');  
const restaurantRoutes = require('./routes/restaurantRoutes');  
const userRoutes = require('./routes/userRoutes');  
const orderRoutes = require('./routes/orderRoutes');  

const app = express();  
require('dotenv').config();  

// Kết nối đến MongoDB  
connectDB();  

// Cấu hình middleware  
app.use(cors());  
app.use(express.json()); // Parse JSON requests  

// Routes  
app.use('/api/v1/auth', authRoutes);  
app.use('/api/v1/restaurants', restaurantRoutes);  
app.use('/api/v1/users', userRoutes);  
app.use('/api/v1/orders', orderRoutes);  

// Khởi động server  
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});