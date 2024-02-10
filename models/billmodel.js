const mongoose=require('mongoose')
const BillSchema=mongoose.Schema({
    CustomerName:{
        type:String,
        required:true
    },
    custombernumber:{
        type:String,
        required:true
    },
    email:{
    type:String,
    required:true
    },
    total:{
        type:String,
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    carditem:{
        type:Array,
        required:true
    },
})
const bills=mongoose.model("bills",BillSchema)
module.exports=bills