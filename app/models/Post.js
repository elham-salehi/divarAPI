const mongoose = require ("mongoose");
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
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});
const PostModel = mongoose.model('post',schema);
module.exports = PostModel;