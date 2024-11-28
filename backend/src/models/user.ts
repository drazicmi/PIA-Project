import mongoose from "mongoose";

const Schema = mongoose.Schema


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
    creditCardNumber : {
        type : Number
    },
    profilePicture: {
        type: Buffer
    },
    profilePictureType: {
        type: String
    },   
    isApproved : {
        type: String
    },
    firmName : {
        type: String,
        default: ''
    },
    busy : {
        type: Boolean,
        default: false
    }
});


export default mongoose.model("User", User, "users"); // ime modela, ime scheme, ime u bazi