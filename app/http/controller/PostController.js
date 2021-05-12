const PostModel = require('../../models/Post');
const _ = require('lodash');
const {validateCreatePost,validateUpdatePost} = require('../validator/PostValidator');

class PostController {
    async getAll (req,res){
        const list = await PostModel.find().select("title description price postTime city district");
        res.send(list);
    };
    async getOne (req,res){
        const id = req.params.id;
        const data = await PostModel.findById(id);
        if(!data) return res.status(404).send("not found!");
        res.send(data);
    };
    async create (req,res){
        const {error} = validateCreatePost(req.body);
        if(error) return res.status(400).send(error.message);
        let post = new PostModel(_.pick(req.body,[
            'title',
            'description',
            'price',
            'city',
            'district',
            'category'
        ])
        );
        post = await post.save();
        res.send(post);
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