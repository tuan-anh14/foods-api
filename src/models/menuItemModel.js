const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    title: { type: String, required: true },
    basePrice: { type: Number, required: true },
    image: { type: String },
    options: [
      {
        title: { type: String },
        description: { type: String },
        additionalPrice: { type: Number }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('menuitems', menuItemSchema);
