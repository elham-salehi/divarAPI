const multer = require('multer');
const router = require('express').Router();
const postController = require('../http/controller/PostController');
const Auth = require("../http/middleware/Auth")

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+"-"+file.originalname)
    }
})
const upload = multer({storage: storage})


router.get('/my-posts',Auth,postController.getMyPosts);
router.post('/new',Auth,upload.array("images",10),postController.create);
router.put('/:id',Auth,postController.update);
router.delete('/:id',Auth,postController.delete);

module.exports = router;