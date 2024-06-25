const express=require('express');
const morgan=require('morgan')
const bodyparser=require('body-parser')
const billmodel=require("./models/billmodel")
const usermodel=require('./models/User')
const cors=require('cors')
const dotenv=require('dotenv')
const session=require('express-session')
const passport=require('passport');
const cookie=require('cookie-session');
const swaggerjsdocx=require('swagger-jsdoc');
const swaggerui=require('swagger-ui-express');
const auth=require('passport-google-oauth20').Strategy;
const coonectdb=require('./config/config');
// const password_Setup=require('./passport');
// const billmodel=require('../models/billmodel')

//.env config
dotenv.config();

//db call
coonectdb()

//port
const PORT=process.env.PORT||1201
//rest object
const app=express()

//middleware
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.json())
app.use(morgan("dev"));


//google login
app.use(
    cors({
        origin:'https://footwear-frontend-xi.vercel.app/',
        methods:"GET,POST,DELETE,PUT",
        credentials:true
    })
)
//setup session
app.use(session(
    {
        secret:"kdwfgwuief7w8evwbye",
        resave:false,
        saveUninitialized:true
    }
))
app.use(passport.initialize())
app.use(passport.session())

// passport.use(
//     new auth(
//         {
//             clientID:process.env.CLIENT_ID,
//             clientSecret:process.env.CLIENT_SECRET,
//             callbackURL:"/auth/google",
//             scope:["profile","email"]
//         },
//         async(accessToken,refreshToken,profile,callback)=>{
//             try{
//                 let user=await usermodel.findOne({googleid:profile.id})
//                 return callback(null,user);
//             }
//             catch(error){
//                 return callback(error,null);
//             }
            
//         }
//     )
// )


// //swagger configuration
// const options = {
//     definition: {
//       openapi: '3.0.1',
//       info: {
//         title: 'Mini Blog API',
//         description: "API endpoints for a mini blog services documented on swagger",
//         contact: {
//           name: "bikash",
//           email: "info@miniblog.com",
//           url: "https://github.com/DesmondSanctity/node-js-swagger"
//         },
//         version: '1.0.0',
//       },
//       servers: [
//         {
//           url: "http://localhost:1200",
//           description: "Local server"
//         },
//         {
//           url: "<your live url here>",
//           description: "Live server"
//         },
//       ]
    
//     },
//     apis: ['./routes/itemRoute.js'], // files containing annotations as above
//   };
  
//   const openapiSpecification = swaggerjsdocx(options);
//   app.use('/api-docs',swaggerui.serve,swaggerui.setup(openapiSpecification))

//delete user 
 app.delete('/user/:id',async(req,res)=>{
    let a=req.params.id;
    let data= await billmodel.deleteOne({_id:a});
    res.send(data)
    console.log(a);
 })

//routes
app.use('/',require('./routes/itemRoute'));
app.use('/user',require('./routes/userRoutes'))

app.listen(PORT,()=>{
    console.log(`app running at port no.:-${PORT}`)
})

