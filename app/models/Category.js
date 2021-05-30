const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    }
});

const CategoryModel = mongoose.model('category',schema);
module.exports = CategoryModel;