import mongoose from "mongoose";

const connectDB = async () => {
    if(!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined in environment variables");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to DB`);
    } catch (error) {
        console.log(`Error connecting to DB:`, error);
    }
}

export default connectDB;