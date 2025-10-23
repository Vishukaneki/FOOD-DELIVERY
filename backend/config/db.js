import mongoose from "mongoose";
const connectDB = async () => {
    await mongoose.connect('mongodb+srv://VishuKaneki:%40mM9811848005@cluster0.hpyzk8e.mongodb.net/food-delivery').then(() => {
        console.log("MongoDB connected successfully");
    }   ).catch((err) => {
        console.log("MongoDB connection failed", err);
    });
}
export default connectDB;