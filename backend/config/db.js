import mongoose from "mongoose";
const connectDB = async () => {
    await mongoose.connect(Process.env.MONGO_URI).then(() => {
        console.log("MongoDB connected successfully");
    }   ).catch((err) => {
        console.log("MongoDB connection failed", err);
    });
}
export default connectDB;
