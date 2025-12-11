import mongoose from "mongoose";

//Function to connect to mongoDB Database
export const connectDB = async()=>{
    try{
        // ADDED VALIDATION: Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        //event to check if mongoose is connected to database
        mongoose.connection.on('connected', ()=>{
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on('error', (error) => {
            console.error("MongoDB connection error:", error);
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/Samvaad`)
    }catch(error){
        console.error("Database connection failed:", error.message);
        // ADDED: Re-throw the error so caller knows connection failed
        throw error;
    }
}