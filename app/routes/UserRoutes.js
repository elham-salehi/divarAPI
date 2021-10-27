const multer = require('multer');
const multerS3 = require('multer-s3')
const router = require('express').Router();
const postController = require('../http/controller/PostController');
const Auth = require("../http/middleware/Auth");
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: '1a460635-5d80-4c4b-98db-c8f90c081f99',
    secretAccessKey: '57895af5ae8a3da1ffeda025ae083d9b9fb167c6f92c3f1287ae12152a42056f',
    endpoint: 'https://s3.ir-thr-at1.arvanstorage.com',
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
    })});



/**
 * @swagger
 * /api/my-divar/my-posts:
 *   get:
 *     summary: Returns the list of all the posts by user
 *     security:
 *      - jwt: []
 *     tags: [Posts]
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
 *        description: The posts by user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *       404:
 *        description: The posts were not found
 *       500:
 *        description: Some error happened
 */
router.get('/my-posts',Auth,postController.getMyPosts);

/**
 * @swagger
 * /api/my-divar/new:
 *   post:
 *     summary: Create new post by user
 *     security:
 *      - jwt: []
 *     tags: [Posts]
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *        description: new post saved
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *       500:
 *        description: Some error happened
 */
router.post('/new',Auth,upload.array("images",10),postController.create);

/**
 * @swagger
 * /api/my-divar/{id}:
 *   put:
 *     summary: Update a post by id
 *     security:
 *      - jwt: []
 *     tags: [Posts]
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *        description: post updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *       404:
 *        description: The post were not found
 *       500:
 *        description: Some error happened
 */
router.put('/:id',Auth,postController.update);

/**
 * @swagger
 * /api/my-divar/{id}:
 *   delete:
 *     summary: Delete a post by id
 *     security:
 *      - jwt: []
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
 *         description: Post deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *        description: The post were not found
 *       500:
 *        description: Some error happened
 */
router.delete('/:id',Auth,postController.delete);

module.exports = router;