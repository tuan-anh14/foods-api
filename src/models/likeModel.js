const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, 
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants', required: true }, 
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('likes', likeSchema);
