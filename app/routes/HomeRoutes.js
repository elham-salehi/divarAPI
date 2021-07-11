const router = require('express').Router();
const postController = require('../http/controller/PostController');
const userController = require('../http/controller/UserController');
const cityController = require('../http/controller/CityController');
const categoryController = require('../http/controller/CategoryController');

router.post('/sendVerifyCode',userController.sendVerifyCode);
router.post('/login',userController.login);

router.get('/categories',categoryController.getAll);
router.get('/cities',cityController.getAll);
router.get('/:city',postController.getPostsByCity);
router.get('/:id',postController.getOne);



module.exports = router;