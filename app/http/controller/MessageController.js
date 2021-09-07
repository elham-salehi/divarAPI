// const MessageModel = require('../../models/Message');
// const ConversationModel = require('../../models/Conversation');
//
// class MessageController {
//     async sendMessage (req,res){
//         console.log("body",req.body)
//        try {
//             let conversation = await ConversationModel.findOne( {$or: [{$and: [{user:{$in: [req.user._id]}}, {contact : {$in: [req.body.recipientId]}} , {post:{$in: [req.body.postId]}}]},{$and: [{user:{$in: [req.body.recipientId]}}, {contact : {$in: [req.user._id]}} , {post:{$in: [req.body.postId]}}]}]})
//                 .populate("contact");
//             if(!conversation){
//                conversation= new ConversationModel({user: req.user._id , contact: req.body.recipientId ,post: req.body.postId});
//               conversation = await conversation.save();
//             }
//            let message = new MessageModel({text: req.body.message, sender: (req.user._id == conversation.contact._id), conversation: conversation});
//            message = await message.save();
//            res.send(message);
//        }
//         catch (err){
//                 console.log(err);
//             }
//     }
//     async getAllConversations(req,res) {
//         try{
//         const list = await ConversationModel.find({ $or:[{user:{$in: [req.user._id]}}, {contact : {$in: [req.user._id]}}]}).populate("user", "phoneNumber")
//             .populate("contact","phoneNumber").populate("post", "images title");
//         res.send(list);
//     }
//     catch(err){
//         console.log(err)
//     }
//     }
//     async getAllMessages (req,res){
//         try{
//             const data = await MessageModel.find({ conversation : { $in: [req.params.id] }}).populate("conversation","contact user");
//             res.send(data);
//         }
//         catch(err){
//             console.log(err)
//         }
//     };
//     async getConversationByPostId (req,res) {
//         try{
//             const conversation = await  ConversationModel.findOne({$and : [{post : { $in: [req.params.postId]}},{user: { $in: [req.user._id]}}]}).populate("post" , "_id")
//             res.status(200).send(conversation);
//         }
//         catch(err){
//             console.log(err)
//         }
//     }
// }
//
// module.exports = new MessageController();