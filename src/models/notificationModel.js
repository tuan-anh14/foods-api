const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, 
    title: { type: String, required: true },
    message: { type: String, required: true }, 
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('notifications', notificationSchema);
