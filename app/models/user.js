const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    phoneNumber : {
        type: Number,
        required: true,
        unique: true
    }
})
