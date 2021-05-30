const CategoryModel = require('../../models/Category')

class CategoryController {
    async getAll (req,res){
        try{
            const list = await CategoryModel.find();
            res.send(list);
        }
        catch(err){
            console.log(err)
        }
    };
}

module.exports = new CategoryController();