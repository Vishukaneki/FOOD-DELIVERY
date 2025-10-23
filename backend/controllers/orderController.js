import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from the frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        
        // Fix 1: Use $set to clear the cart (which is a Map/Object)
        await userModel.findByIdAndUpdate(req.body.userId, { $set: { cartData: {} } });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                // Fix 2: Removed extra * 80. Amount must be in paise.
                unit_amount: item.price * 100 *80,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery charges" },
                // Fix 2: Removed extra * 80.
                unit_amount: 2 * 100 *80, // Assuming 2 INR delivery charge
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Fix 3: Changed response key from 'url' to 'session_url' to match frontend
        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred" });
    }
};
const verifyOrder= async (req,res)=>{
    const {orderId,success}= req.body;
    try{
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.status(200).json({success:true,message:"Order placed successfully"});
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({success:false,message:"Order placed failed"});
        }
    }catch(error){
        console.log(error);
        res.json({success:false,message:"An error occurred"});
    }
}

const userOrders = async (req,res)=>{

}
export { placeOrder ,verifyOrder, userOrders};