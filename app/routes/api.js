const router= require('express').Router();
const PostRoutes= require('./PostRoutes');

router.use('/post',PostRoutes);

module.exports=router;