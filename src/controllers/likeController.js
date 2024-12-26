const LikeModel = require('../models/likeModel');
const asyncHandler = require('express-async-handler');

// API: Like hoặc Dislike một nhà hàng
const likeRestaurant = asyncHandler(async (req, res) => {
    const { restaurant, quantity } = req.body;

    if (!restaurant || !quantity) {
        return res.status(400).json({ message: 'Missing required fields: restaurant or quantity' });
    }

    const userId = req.user.id; // Lấy userId từ middleware xác thực

    // Kiểm tra nếu đã tồn tại lượt thích cho nhà hàng này
    const existingLike = await LikeModel.findOne({ user: userId, restaurant });

    if (existingLike) {
        // Nếu số lượng bằng 0, xóa lượt thích
        if (existingLike.quantity + parseInt(quantity, 10) === 0) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: 'Removed like/dislike successfully' });
        }

        // Cập nhật số lượng like/dislike
        existingLike.quantity += parseInt(quantity, 10);
        await existingLike.save();
        return res.status(200).json({ message: 'Updated like/dislike successfully' });
    } else {
        // Nếu không có lượt thích trước đó, tạo mới
        if (parseInt(quantity, 10) !== 0) {
            const newLike = new LikeModel({
                user: userId,
                restaurant,
                quantity: parseInt(quantity, 10),
            });
            await newLike.save();
            return res.status(201).json({ message: 'Liked/disliked restaurant successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid quantity: must not be 0 for new like/dislike' });
        }
    }
});

// API để lấy danh sách các nhà hàng đã liked
const getLikedRestaurants = async (req, res) => {
    const { current = 1, pageSize = 10 } = req.query;
    const userId = req.user.id; // Lấy ID người dùng từ token
  
    try {
      // Lấy danh sách các nhà hàng đã liked của người dùng
      const likes = await LikeModel.find({ user: userId })
        .skip((current - 1) * pageSize) // phân trang
        .limit(Number(pageSize)) // giới hạn số lượng
        .populate('restaurant'); // Join với bảng restaurant (để lấy thông tin nhà hàng)
  
      // Trả về kết quả
      res.status(200).json({
        success: true,
        message: 'Liked restaurants retrieved successfully',
        data: likes,
        pagination: {
          current: Number(current),
          pageSize: Number(pageSize),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving liked restaurants',
      });
    }
  };

module.exports = { likeRestaurant, getLikedRestaurants };
