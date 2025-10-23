import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import foodRouter from './routes/foodRoute.js';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
dotenv.config();
// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());

// db config
connectDB();
// api end points

app.use('/api/food', foodRouter);
app.use("/images", express.static("uploads"));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/', (req, res) => {
    res.status(200).send('API is running...'); 
});

// listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
 

//mongodb+srv://VishuKaneki:<db_password>@cluster0.hpyzk8e.mongodb.net/?
// retryWrites=true&w=majority&appName=Cluster0