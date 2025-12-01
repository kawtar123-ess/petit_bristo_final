const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
  category: String,
  name: String,
  description: String,
  price: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
