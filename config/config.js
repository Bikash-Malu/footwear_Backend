const mongoose=require('mongoose')
const connectdb=async()=>{
    try{
        const conn=await mongoose.connect("mongodb+srv://bikash123:L4nJqgUIVXfBF4Lr@cluster0.dfxjq7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log(`mongodb connect ${conn.connection.host}`)
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}
module.exports=connectdb