const express=require('express')
const {addbills, getItem,saveitem, deleteitem, upadteitem, signup, login, search, getbill, send, mail } = require('../controller/itemController')
const router=express.Router()
router.get('/items',getItem)
router.post('/save',saveitem)
router.delete('/:id',deleteitem)
router.put('/',upadteitem)
router.post('/sign',signup)
router.post('/login',login)
router.get('/:key',search)
router.post('/add',addbills);
router.post('/bikash',getbill);
router.post('/sms',send)
router.post('/email',mail)
module.exports=router