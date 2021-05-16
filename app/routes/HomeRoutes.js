const router = require('express').Router();
const postController = require('../http/controller/PostController');
const userController = require('../http/controller/UserController');

router.post('/sendVerifyCode',userController.sendVerifyCode);
router.post('/login',userController.login);

router.get('/',postController.getAll);
router.get('/:id',postController.getOne);


module.exports = router;