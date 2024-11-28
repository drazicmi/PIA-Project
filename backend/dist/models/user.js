"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const User = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    type: {
        type: String
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
    },
    address: {
        type: String,
    },
    contactPhone: {
        type: Number,
    },
    email: {
        type: String,
        unique: true
    },
    creditCardNumber: {
        type: Number
    },
    profilePicture: {
        type: Buffer
    },
    profilePictureType: {
        type: String
    },
    isApproved: {
        type: String
    },
    firmName: {
        type: String,
        default: ''
    },
    busy: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.default.model("User", User, "users"); // ime modela, ime scheme, ime u bazi
