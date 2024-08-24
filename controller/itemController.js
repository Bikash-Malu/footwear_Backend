const itemmodel=require('../models/itemModel')
const usermodel=require('../models/User')
const billmodel=require('../models/billmodel')
const twilio=require('twilio')
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const jwtsecret=process.env.jwtsecret;
 const getItem=async(req,res)=>{
    try{
        const items=await itemmodel.find({})
        res.status(200).send(items)
    }
    catch(error){
        console.log(error)
    }
}
const saveitem=async(req,res)=>{
    try{
    const data=req.body;
    const items= await new itemmodel(data).save()
    res.status(200).send(items)
    }
    catch(error){
        console.log(error)
        res.status(400).send("can not be add")
    }
}
   const deleteitem=async(req,res)=>{
    try{
        const a=req.params.id;
        let item=await itemmodel.deleteOne({_id:a})
        res.status(201).send(item)
    }
    catch(error){
        res.status(400).send(error)
    }
   }
   const upadteitem=async(req,res)=>{
    try{
    const a=req.params.id;
    const b=req.body;
    let result=await itemmodel.updateOne({_id:req.body.itemId},b)
    res.status(200).send(result)
    }
    catch(error){
        res.status(400).send(error)
    }
   }
 const signup=async(req,res)=>{
    try{
    let a=req.body;
    console.log(a)
    const salt=await bcrypt.genSalt(10);
    let pass=await bcrypt.hash(a.password,salt);
    a.password=pass;
    console.log(a)
    let data=await new usermodel(a).save();
    res.status(200).send(data)
    }
    catch(error){
        res.status(400).send(error)
    }
 } 
const login=async(req,res)=>{
let email=req.body.email;
let user=await usermodel.findOne({email})
if(user){
    const data={
        one:{
            id:user.id
        }
       }
       console.log("tahi is",data)
const expirationTime='1h';
const autotoken=jwt.sign(data,jwtsecret,{expiresIn:expirationTime})
const newpwd = await bcrypt.compare(req.body.password, user.password);
if (newpwd) 
{
    res.json({user,autotoken:autotoken});
  } else {
    return res.status(400).send("password is not correct");
  }
} 
else {
  res.status(400).send("email not correct")
}
}
const search=async(req,res)=>{
    try{
        const a=req.params.key;
        let data=await itemmodel.find({
            "$or":[
                {"name":{$regex:a}}
            ]
        })
        res.status(200).send(data)
    }
    catch(error){
        res.send(error)
    }

}
const addbills=async(req,res)=>
    {
        try{
            const data=req.body;
            const d = new Date();
            let text = d.toLocaleString();
            const items= await new billmodel(data).save()
            res.status(200).send(items)
            const client=await new twilio(process.env.TWILIO_SILD,process.env.TWILIO_AUTH)
            console.log(req.body.message)
            client.messages.create({
                from:'whatsapp:+14155238886',
                body:`${data.CustomerName} bill is created sucessfully with amount ${data.total}/- at ${text}`,
                to:'whatsapp:+919583856595',
            }).then((res1)=>
                res.send('send successfully')
            ).catch((err)=>
                console.log('send unsuccessfully')
            )
            }
            catch(error){
                console.log(error)
                res.status(400).send("can not be add")
            }
            const data=req.body;
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure:false,
                requireTLS:true,
                auth: {
                    user: 'bikashmalu1@gmail.com',
                    pass: 'fkgdymbfaqklrcln'
                }
            });
            const info ={
                from: 'bikashmalu1@gmail.com',
                to: req.body.email, 
                subject: "BALA FOOTWEAR",
                text: "hii everyone tuhina is cute",
                html: `Thank you ${data.CustomerName},for purchasing products with amount ${data.total} from the bala footwear store. Thank you visit again!!`, 
              };
        transporter.sendMail(info,(err,result)=>{
            if(err){
                res.status(400).send(err)
            }
            else{
                res.status(200).send(result.response);
            }
        })
    }
    const getbill=async(req,res)=>{
        try{
            const items=await billmodel.find({})
            res.status(200).send(items)
        }
        catch(error){
           res.status(400).send(error)
        }
    }
    const send=async(req,res)=>{
        // const client=await new twilio(process.env.TWILIO_SILD,process.env.TWILIO_AUTH)
        // console.log(req.body.message)
        // client.messages.create({
        //     from:'whatsapp:+14155238886',
        //     body:req.body.message,
        //     to:'whatsapp:+919583856595',
        // }).then((res1)=>
        //     res.send('send successfully')
        // ).catch((err)=>
        //     console.log('send unsuccessfully')
        // )
    }    
const mail=async(req,res)=>{
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure:false,
//         requireTLS:true,
//         auth: {
//             user: 'bikashmalu1@gmail.com',
//             pass: 'fkgdymbfaqklrcln'
//         }
//     });
//     const info ={
//         from: 'bikashmalu1@gmail.com',
//         to: "bikashmalu220@gmail.com", 
//         subject: "Hello node js",
//         text: "hii everyone tuhina is cute",
//         html: "<b>Hello world?</b>", 
//       };
// transporter.sendMail(info,(err,result)=>{
//     if(err){
//         res.status(400).send(err)
//     }
//     else{
//         res.status(200).send(result.response);
//     }
// })
}
const forget_password=async(req,res)=>{
//     try{
//         const email=req.body.email;
//    const userdata=await usermodel.findOne({email})
//    if(userdata){
//     const randomstring=random.generate();
//     const data=await usermodel.updateOne({email:email},{token:randomstring})
//     res.status(200).json({success:true,msg:"plz check yor mail"})
//    }
//    else{
//     res.status(200).json({success:true,msg:"the email does not exist"});
//    }
//     }
//     catch(error){
//         res.status(400).json({success:false,msg:error.message})
//     }
}

module.exports={getItem,addbills,saveitem,deleteitem,upadteitem,signup,login,search,getbill,send,mail,forget_password};
