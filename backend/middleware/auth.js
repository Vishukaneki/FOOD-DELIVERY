import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authMiddleware = async (req, res, next) => {
    const {token}= req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // req.body.userId = token_decode.id;  
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("Error in auth middleware:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}
export default authMiddleware;