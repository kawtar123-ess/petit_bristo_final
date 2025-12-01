const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    items: [
      {
        name: {
          type: String,
          required: true
        },
        category: {
          type: String,
          required: true
        },
        description: String,
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      },
      { _id: false }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
