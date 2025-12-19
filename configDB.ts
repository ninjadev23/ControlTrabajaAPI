import mongoose from "mongoose"

const mongoDBURL = process.env.mongoDBURL as string
export default (async ()=>{
    try{
        await mongoose.connect(mongoDBURL)
        console.log("MongoDB Connected!")
    }catch(err){
        console.log("Error :>>", err)
        process.exit(1)
    }
})()