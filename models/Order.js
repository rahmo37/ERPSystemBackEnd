// /models/Order.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  currentAvailabilityStatus: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  orderID: { type: Number, unique: true, required: true },
  customerID: { type: String, required: true }, // Reference to Customer
  orderStatus: { type: String, default: "pending" },
  orderDate: { type: Date, default: Date.now },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  tax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
});

// Create the Order model based on the schema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;