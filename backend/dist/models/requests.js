"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./user")); // Assuming User model is imported correctly
const Schema = mongoose_1.default.Schema;
// Define the schema for Requests
const Requests = new Schema({
    user: {
        type: user_1.default.schema,
        required: true
    },
    approved: {
        type: Boolean,
        default: false // Default value for approved
    }
});
// Export the model
exports.default = mongoose_1.default.model("Requests", Requests, "requests");
