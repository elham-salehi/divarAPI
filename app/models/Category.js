const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    id : {
      type : Number,
      required: true
    },
    name : {
        type: String,
        required: true,
    }
});

const CategoryModel = mongoose.model('category',schema);
module.exports = CategoryModel;