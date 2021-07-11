const PostModel = require('../../models/Post');
const _ = require('lodash');
const CityModel = require("../../models/City");
const CategoryModel = require("../../models/Category");
const {validateCreatePost,validateUpdatePost} = require('../validator/PostValidator');

class PostController {
    async getPostsByCity (req,res){
       try {
           const city = await CityModel.findOne({name:{$in: [req.params.city]}});
            const list = await PostModel.find({city: {$in: [city._id]}}).populate("user", "phoneNumber")
                .populate("city", "name" );
            res.status(200).send(list);
        }
        catch (err){
            console.log(err)
        }
    };
    async getMyPosts (req,res){
        let list = await PostModel.find({ user : { $in: [req.user._id] }}).populate("user","phoneNumber");
        res.send(list);
    };
    async getOne (req,res){
        const id = req.params.id;
        const data = await PostModel.findById(id);
        if(!data) return res.status(404).send("not found!");
        res.send(data);
    };
    async create (req,res){
       try{const {error} = validateCreatePost(req.body);
        if(error) return res.status(400).send(error.message);
        const city = await CityModel.findOne({ name : { $in: [req.body.city] }});
        const category = await CategoryModel.findOne({ name : { $in: [req.body.category] }});
           console.log("test",{city},{category})
        let post = new PostModel({..._.pick(req.body,[
            'title',
            'description',
            'price',
            'district',
        ]),images :req.files.map(file => file.filename), user :req.user._id, city :city._id, category :category._id});
        post = await post.save();
        res.send(post);}
        catch (err){
            console.log(err)
        }
    };
    async update (req,res){
        const id = req.params.id;
        const {error} = validateUpdatePost(req.body);
        if(error) return res.status(400).send(error.message);
        const result = await PostModel.findByIdAndUpdate(id,{
            $set:_.pick(req.body,[
                'title',
                'description',
                'price',
                'city',
                'district',
                'category'
            ]),
        },{new : true});
        if (!result) return res.status(404).send("not found!");
        res.send(_.pick(result,[
            'title',
            'description',
            'price',
            'city',
            'district',
            'category'
        ]),
            );
    };
    async delete (req,res){
        const id = req.params.id;
        const result = await PostModel.findByIdAndDelete(id);
        res.status(200).send();
    };
}

module.exports = new PostController();