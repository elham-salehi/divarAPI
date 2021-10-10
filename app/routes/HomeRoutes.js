const router = require('express').Router();
const postController = require('../http/controller/PostController');
const userController = require('../http/controller/UserController');
const cityController = require('../http/controller/CityController');
const categoryController = require('../http/controller/CategoryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the city
 *         name:
 *           type: string
 *           description: The city name
 *       example:
 *         id: 6153a4bb0ee66f4433efb558
 *         name: تهران
 *
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the category
 *         name:
 *           type: string
 *           description: The category name
 *       example:
 *         id: 1
 *         name: املاک
 *
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - postTime
 *         - city
 *         - district
 *         - category
 *         - images
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *         description:
 *           type: string
 *           description: The post description
 *         price:
 *           type: number
 *           description: The post price
 *         postTime:
 *           type: time
 *           description: The time that post created
 *         city:
 *           type: string
 *           description: The city of the post
 *         district:
 *           type: string
 *           description: The district of the post's city
 *         category:
 *           type: string
 *           description: The post category
 *         images:
 *           type: [string]
 *           description: The post images
 *         user:
 *           type: string
 *           description: The user that created the post
 *       example:
 *         - id: 6153a4bb0ee66f4433efb558
 *           title: گوشی آیفون 7
 *           description: حافظه 128 MB
 *           price: 70000000
 *           postTime: 2021-10-05T11:45:32.409Z
 *           city:
 *             id: 615514bd031931a3d1e0e243
 *             name: تهران
 *           district: سعادت آباد
 *           category: 615514bd031931a3d1e0e2cd
 *           images:
 *            - 1633440562157-apple.jpg
 *            - 1633436520789-apple2_.jpg
 *           user:
 *            id: 6155184f031931a3d1e0e2da
 *            phoneNumber: "09123456789"
 *     User:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number
 *       example:
 *         phoneNumber: "09123456789"
 *
 *     VerifyCode:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: number
 *           description: The verify code
 *       example:
 *         code: 123456
 *
 */

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: The cities managing API
 */
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 */
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */


/**
 * @swagger
 * /api/sendVerifyCode:
 *   post:
 *     summary: send the verify code to user phone number for registering
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *        description: The verify code has send
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       500:
 *        description: Some error happened
 */
router.post('/sendVerifyCode',userController.sendVerifyCode);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: login by verify code has send to phone number
 *     tags: [Users]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/VerifyCode'
 *     responses:
 *       200:
 *        description: you are logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       500:
 *        description: Some error happened
 */
router.post('/login',userController.login);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Returns the list of all the categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of the Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *        description: The categories were not found
 *       500:
 *        description: Some error happened
 */
router.get('/categories',categoryController.getAll);

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Returns the list of all the cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: The list of the Cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       404:
 *        description: The cities were not found
 *       500:
 *        description: Some error happened
 */
router.get('/cities',cityController.getAll);

/**
 * @swagger
 * /api/{city}:
 *   get:
 *     summary: Returns the list of all the posts by city name
 *     tags: [Posts]
 *     parameters:
 *      - in: path
 *        name: city
 *        schema:
 *          type: string
 *        required: true
 *        description: The city name
 *     responseBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *        description: The posts by city name
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *       404:
 *        description: The posts were not found
 *       500:
 *        description: Some error happened
 */
router.get('/:city',postController.getPostsByCity);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Returns the details of a post by ID
 *     tags: [Posts]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *     responses:
 *       200:
 *         description: The details of a Post
 *         content:
 *           application/json:
 *             schema:
*               $ref: '#/components/schemas/Post'
 *       404:
 *        description: The post was not found
 *       500:
 *        description: Some error happened
 */
router.get('/posts/:id',postController.getOne);





module.exports = router;