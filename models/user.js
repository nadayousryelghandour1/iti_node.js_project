const mongoose = require('mongoose');
const { Schema } = mongoose;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name should be at least 3 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true 
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password should be at least 8 characters"]
    }
});

module.exports = mongoose.model("User", userSchema);
