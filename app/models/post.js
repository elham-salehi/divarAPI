const mongoose = require ("mongoose");
const schemaSender = new mongoose.Schema({
    phoneNumber : {
        type: Number,
        required: true,
        unique: true
    }
});
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    postTime: {
        type: Date,
        default: Date.now()
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    },
    sender: {
        type: schemaSender,
        required: true,
    }
});
const model= mongoose.model("post",schema);
module.exports= model;