const multer = require('multer');
const multerS3 = require('multer-s3')
const router = require('express').Router();
const postController = require('../http/controller/PostController');
const Auth = require("../http/middleware/Auth");
const AWS = require('aws-sdk');
const apiKeys = require('../../apiKeys');
const s3 = new AWS.S3({
    accessKeyId: apiKeys.accessKeyId,
    secretAccessKey: apiKeys.secretAccessKey,
    endpoint: apiKeys.endpoint,
});

const upload = multer({
    storage: multerS3({
        s3 : s3,
        bucket: 'divarapi',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb){
            cb(null, Date.now()+"-"+file.originalname);
        }
    })})

router.get('/my-posts',Auth,postController.getMyPosts);
router.post('/new',Auth,upload.array("images",10),postController.create);
router.put('/:id',Auth,postController.update);
router.delete('/:id',Auth,postController.delete);

module.exports = router;