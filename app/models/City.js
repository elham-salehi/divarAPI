const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    }
});

const CityModel = mongoose.model('city',schema);
module.exports = CityModel;