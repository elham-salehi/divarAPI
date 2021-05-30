const mongoose = require ("mongoose");
const schema = new mongoose.Schema({
    title: {
        type: String,

    },
    description: {
        type: String,

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
    },
    category: {
        type: String,

    },
    images: {
        type: [String]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});
const PostModel = mongoose.model('post',schema);
module.exports = PostModel;