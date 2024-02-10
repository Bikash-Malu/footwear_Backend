const mongoose=require('mongoose')
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    googleid:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:''
    }
})
const user=mongoose.model('users',UserSchema)
module.exports=user