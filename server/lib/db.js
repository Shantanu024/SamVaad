import mongoose from "mongoose";

//Function to connect to mongoDB Database
export const connectDB = async()=>{
    try{

        //event to check if mongoose is connected to database
        mongoose.connection.on('connected', ()=>{
            console.log("MongoDB connected successfully");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/Samvaad`)
    }catch(error){
        console.log(error)
    }
}