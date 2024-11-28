import mongoose from "mongoose";
import User from "./user"; // Assuming User model is imported correctly

const Schema = mongoose.Schema;

// Define the schema for Requests
const Requests = new Schema({
    user: {
        type: User.schema,
        required: true
    },
    approved: {
        type: Boolean,
        default: false // Default value for approved
    }
});

// Export the model
export default mongoose.model("Requests", Requests, "requests");