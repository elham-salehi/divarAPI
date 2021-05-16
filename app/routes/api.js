const router= require('express').Router();
const HomeRoutes= require('./HomeRoutes');
const UserRoutes= require('./UserRoutes');

router.use('/',HomeRoutes);
router.use('/my-divar',UserRoutes);

module.exports=router;