import mongoose from "mongoose";
import User from "./user"; // Assuming User model is imported correctly

const Schema = mongoose.Schema;

// Define the schema for Firms
const Firms = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  services: {
    type: [String],  // Array of service names
    required: true,
  },
  service_prices: {
    type: [Number],  // Array of service prices
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  decorator_list: {
    type: [String],
    required: true,
  },
  vacation_start: {
    type: Date,
    required: true,
  },
  vacation_end: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true
  }
});

// Export the model
export default mongoose.model("Firms", Firms, "firms");
