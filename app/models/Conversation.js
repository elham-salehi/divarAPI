const mongoose = require ("mongoose");

const messageSchema = new mongoose.Schema({
    text : {
        type: String,
    },
    time : {
        type: Date,
        default: new Date()
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    seen: {
        type: Boolean,
        default: false
    }
});


const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    lastMsgTime: {
        type: Date
    },
    messages: [messageSchema]

});

const ConversationModel = mongoose.model('conversation',schema);
module.exports = ConversationModel;