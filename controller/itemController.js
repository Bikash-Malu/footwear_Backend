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
const addbills = async (req, res) => {
  try {
    const data = req.body;
    const d = new Date();
    let timestamp = d.toLocaleString();

    // Save bill data to the database
    const bill = await new billmodel(data).save();
    res.status(200).send(bill);

    // Send WhatsApp message via Twilio
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      body: `${data.CustomerName}, your bill has been successfully created with an amount of ₹${data.total}/- at ${timestamp}`,
      to: 'whatsapp:+919583856595',
    });

    // Send a stylish email with Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'bikashmalu1@gmail.com',
        pass: 'fkgdymbfaqklrcln',
      },
    });

const emailTemplate = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="text-align: center;">
      <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/thank-you-for-shopping-with-us-flyer-design-template-310398c8721e6c754bd88c65129be38f_screen.jpg?ts=1618347818" alt="Thank You Image" style="max-width: 100%; height: auto;">
    </div>
    <h2 style="color: #2C3E50;">Thank you, ${data.CustomerName}!</h2>
    <p>We appreciate your purchase at Bala Footwear. Here are the details of your transaction:</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.CustomerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">₹${data.total}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${timestamp}</td>
      </tr>
    </table>
    <p>Thank you for shopping with us. We hope to see you again soon!</p>
    <p>Best regards,<br><strong>Bala Footwear Team</strong></p>
    <hr style="border-top: 1px solid #ddd;">
    <div style="text-align: center;">
      <img src="https://example.com/path/to/your/logo.png" alt="Bala Footwear Logo" style="max-width: 200px;">
      <p style="margin-top: 10px; font-size: 14px; color: #888;">Contact us: +91-9583856595 | <a href="mailto:bikashmalu1@gmail.com">support@balafootwear.com</a></p>
    </div>
  </div>
`;


    const mailOptions = {
      from: 'bikashmalu1@gmail.com',
      to: data.email,
      subject: 'Thank you for your purchase!',
      html: emailTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        res.status(200).send('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Could not add the bill");
  }
};
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

module.exports={getItem,addbills,saveitem,deleteitem,upadteitem,signup,login,search,getbill,send,mail,forget_password}
