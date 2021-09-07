const mongoose = require ("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    phoneNumber : {
        type: Number,
        required: true,
    },
});
schema.methods.generateAuthToken = function () {
    const data = {
        _id: this._id,
        phoneNumber: this.phoneNumber,
        role: "user",
    };

    return jwt.sign(data, config.get('jwtPrivateKey'));
};
const UserModel = mongoose.model('user',schema);
module.exports = UserModel;