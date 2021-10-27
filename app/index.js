const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const ErrorMiddleware = require('./http/middleware/Error');
const api = require('./routes/api');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const io = require("socket.io");
let db = '';
const ConversationModel = require('../app/models/Conversation');
const PostModel = require("./models/Post");
const {userJoin,getUser,getAllUser,removeUser} = require("./utilities/users");

class Application {
    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMiddlewares();
        this.setupConfigs();
    }

    setupRoutesAndMiddlewares() {
        // built-in middleware
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(express.static('public'));

        if (app.get('env') === 'production') app.use(morgan('tiny'));

        // third-party middleware
        app.use(cors());


        //routes
        app.use('/api', api);


        app.use(ErrorMiddleware);

        //swagger
        const options = {
            definition: {
                openapi: "3.0.0",
                components: {
                    securitySchemes: {
                        jwt: {
                            type: "apiKey",
                            scheme: "bearer",
                            in: "header",
                            name: "x-auth-token",
                            bearerFormat: "jwt"
                        },
                    }
                },
                info: {
                    title: 'Divar API',
                    version: '1.0.0',
                    description:
                        "This is a CRUD API application made with Express and documented with Swagger",
                },
                servers: [
                    {
                        url: "https://divar-api.herokuapp.com",
                    },
                ],
            },
            apis: ['./app/routes/*.js'],
        };
        const swaggerSpec = swaggerJsdoc(options);
        app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


    }

    setupConfigs() {
        winston.add(new winston.transports.File({ filename: 'error-log.log' }));
        winston.add(
            new winston.transports.MongoDB({
                db: process.env.MONGODB_URI || config.get('databaseAddress'),
                level: 'error',
            }),
        );

        process.on('uncaughtException', (err) => {
            console.log(err);
            winston.error(err.message);
        });
        process.on('unhandledRejection', (err) => {
            console.log(err);
            winston.error(err.message);
        });

        app.set('view engine', 'pug');
        app.set('views', '../views'); // default
    }

    setupMongoose() {
        mongoose
            .connect(process.env.MONGODB_URI || config.get('databaseAddress'), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('db connected');
                winston.info('db connected');
            })
            .catch((err) => {
                console.error('db not connected', err);
            });
        db = mongoose.connection;
    }
    setupExpressServer() {
        const port = process.env.PORT || 3010;
        const server = app.listen(port, (err) => {
            if (err) console.log(err);
            else console.log(`app listen to port ${port}`);
        });
        const socket = io(server, {
            cors: {
                origin: '*',
            }});
        const mySocket = socket;
        mySocket.on("connection", (socket) => {
            socket.on("joinUser", async (data) => {
                userJoin(socket.id,data.user);
                let users = getAllUser();
                mySocket.emit("showOnlineUsers",users);
            });
            socket.on("loadOldConversations", async (user) =>{
                try{
                    let conversations = await ConversationModel.find({ $or:[{user:{$in: [user.id]}}, {contact : {$in: [user.id]}}]}).populate("user", "phoneNumber")
                        .populate("contact","phoneNumber").populate("post", "images title user")
                        .populate("messages","seen");
                    let newConversations=[];
                    for(let i = 0; i < conversations.length ; i++){
                        let hasUnreadMessages ='';
                        let unreadMessages = await conversations[i].messages.find(message => (message.seen === false && message.sender != user.id));
                        if(unreadMessages)
                            hasUnreadMessages = true;
                        else
                            hasUnreadMessages = false;
                        await newConversations.push({"_id":conversations[i]._id,"user":conversations[i].user ,
                            "contact":conversations[i].contact,"post": conversations[i].post,
                            "messages":conversations[i].messages,"lastMsgTime": conversations[i].lastMsgTime,hasUnreadMessages });

                    }
                    mySocket.to(socket.id).emit("showLoadOldConversations", {user: user.id,conversations: newConversations});
                }
                catch(err){
                    console.log(err)
                }
            });
            socket.on("newConversation", async (data) =>{
                try{
                    const conversations = await ConversationModel.find({ $or:[{user:{$in: [data.userId]}}, {contact : {$in: [data.userId]}}]}).populate("user", "phoneNumber")
                        .populate("contact","phoneNumber").populate("post", "images title user");
                    let foundConversation='';
                    conversations.map((conversation) => {
                        if (((conversation.user._id == data.userId) || (conversation.contact._id == data.userId )) &&  (conversation.post._id == data.paramsId)) {
                            foundConversation = conversation;
                        }
                    })
                    if(foundConversation === '') {
                        let post = await PostModel.findById(data.paramsId).select("title images user").populate("user", "phoneNumber");
                        let conversation={};
                        conversation.post=post;
                        conversation.contact=post.user;
                        conversation.user=data.userId;
                        mySocket.to(socket.id).emit("showConversation", conversation);
                    }
                    else{
                        mySocket.to(socket.id).emit("showConversation",foundConversation)
                    }
                }
                catch(err){
                    console.log(err)
                }
            });
            socket.on("loadOldMessages", async (data) =>{
                try {
                    let conversation = await ConversationModel.findById(data.conversation._id).populate("user", "phoneNumber")
                        .populate("contact","phoneNumber").populate("post", "images title user");
                    await conversation.messages.map((message) => {
                        if(data.user == message.recipient) {
                            message.seen = true

                        }
                    });
                    const contact=getUser(conversation.contact._id);
                    const user=getUser(conversation.user._id);
                    await conversation.save();
                    let newConversation= {};
                    newConversation = {"_id":conversation._id,"user":conversation.user ,
                        "contact":conversation.contact,"post": conversation.post,
                        "messages":conversation.messages,"lastMsgTime": conversation.lastMsgTime,"hasUnreadMessages" :false};
                    if(user) mySocket.to(user.socketId).emit("showLoadOldMessages",{user: data.user,conversation: newConversation});
                    if(contact) mySocket.to(contact.socketId).emit("showLoadOldMessages",{user: data.user, conversation: newConversation});
                }
                catch(err){
                    console.log(err)
                }
            });
            socket.on("isTyping",async (sender) => {

                mySocket.emit("showIsTyping", sender);
            });
            socket.on("newMessage",async (message) => {
                try{
                    const recipient=getUser(message.recipient);
                    const sender=getUser(message.sender);
                    if(!message.conversation){
                        let conversation= await new ConversationModel({user: message.sender , contact: message.recipient ,post: message.postId});
                        conversation = await conversation.save();
                        conversation= await ConversationModel.findById(conversation._id).populate("user", "phoneNumber")
                            .populate("contact","phoneNumber").populate("post", "images title user");
                        message.conversation= conversation;
                    }
                    let conversation = await ConversationModel.findById(message.conversation).populate("user", "phoneNumber")
                        .populate("contact","phoneNumber").populate("post", "images title user");;
                    await conversation.messages.push({text: message.text, sender: message.sender ,recipient:message.recipient, time: message.time});
                    await conversation.save();
                    let msgLength=conversation.messages.length;
                    await conversation.set({lastMsgTime:conversation.messages[msgLength-1].time});
                    await conversation.save();
                    if(sender)  mySocket.to(sender.socketId).emit("showNewMessage", {...message,conversation:conversation,seen:false});
                    if(recipient) mySocket.to(recipient.socketId).emit("showNewMessage", {...message,conversation:conversation,seen:false});


                }
                catch (err){
                    console.log(err);
                }
            });
            socket.on("seenMessage", async (data) => {
                let conversation = await ConversationModel.findById(data.message.conversation._id);
                conversation.messages[(conversation.messages.length)-1].seen = true
                await conversation.save();
                data.message.seen=true;

                mySocket.emit("showSeenMessage",data);
            });

            socket.on("disconnect", () => {
                socket.removeAllListeners();
                removeUser(socket.id);
                let users = getAllUser();
                mySocket.emit("showOnlineUsers",users);
            })
        })
    }

}

module.exports = Application;


