const mongoose = require ("mongoose");

const messageSchema = new mongoose.Schema({
    text : {
        type: String,
        required: true,
    },
    time : {
        type: Date,
        default: new Date(),
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    seen: {
        type: Boolean,
        default: false
    }
});


const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },
    lastMsgTime: {
        type: Date,
        required: true,
    },
    messages: [messageSchema]

});

const ConversationModel = mongoose.model('conversation',schema);
module.exports = ConversationModel;