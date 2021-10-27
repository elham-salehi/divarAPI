const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    postTime: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "city",
        required: true,
    },
    district: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    images: {
        type: [String]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
});
const PostModel = mongoose.model('post', schema);
module.exports = PostModel;