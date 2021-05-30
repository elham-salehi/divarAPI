const PostModel = require('../../models/Post');
const _ = require('lodash');
const {validateCreatePost,validateUpdatePost} = require('../validator/PostValidator');

class PostController {
    async getPostsByCity (req,res){
        const city = req.body.city;
        const list = await PostModel.find({city: {$in: [city]}}).populate("user","phoneNumber -_id");
        res.send(list);
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
        let post = new PostModel({..._.pick(req.body,[
            'title',
            'description',
            'price',
            'city',
            'district',
            'category'
        ]),images :req.files.map(file => file.filename), user :req.user._id});
           console.log("req.files",req.files)
           // let post = new PostModel({
           //     ..._.pick(req.body, [
           //         'title',
           //         'description',
           //         'price',
           //         'city',
           //         'district',
           //         'category',
           //     ]),
           //     user :req.user._id
           // });
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