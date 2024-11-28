"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        type: [String], // Array of service names
        required: true,
    },
    service_prices: {
        type: [Number], // Array of service prices
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
exports.default = mongoose_1.default.model("Firms", Firms, "firms");
