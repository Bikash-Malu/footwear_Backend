const express=require('express')
const {  getbill } = require('../controller/itemController');
const router=express.Router();
router.head('/bill',getbill)
module.exports=router