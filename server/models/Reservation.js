const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  date: String,
  time: String,
  guests: Number,
  specialRequests: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
