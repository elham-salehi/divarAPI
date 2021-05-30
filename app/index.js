const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const ErrorMiddleware = require('./http/middleware/Error');
const api = require('./routes/api');
const app = express();
const fs = require('fs');
let db = '';

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
    }

    setupConfigs() {
        winston.add(new winston.transports.File({ filename: 'error-log.log' }));
        winston.add(
            new winston.transports.MongoDB({
                db: 'mongodb://localhost:27017/divar',
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
            .connect('mongodb://localhost:27017/divar', {
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
        const port = process.env.myPort || 3010;
        app.listen(port, (err) => {
            if (err) console.log(err);
            else console.log(`app listen to port ${port}`);
        });
    }

}

// fs.readFile('cities.json', 'utf8', function (err, data) {
//     let collection = db.collection('cities');
//     collection.insert(JSON.parse(data), function (err, docs) { // Should succeed
//             console.log("[" + data + "]");
//             db.close();
//     });
// });
//
// fs.readFile('categories.json', 'utf8', function (err, data) {
//     let collection = db.collection('categories');
//     collection.insert(JSON.parse(data), function (err, docs) {
//             console.log("[" + data + "]");
//             db.close();
//     });
// });

module.exports = Application;
