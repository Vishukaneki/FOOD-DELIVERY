import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

// token creation function
const createTOKEN = (id) => {
    // You have a small typo here: createTOKEN -> createToken
    // And process.env.JWT_SECRET should be the second argument.
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

// login user function
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // 2. Find user in the database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // 3. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // 4. Create a token if login is successful
        const token = createTOKEN(user._id); // Using your createTOKEN function
        res.json({ success: true, token });

    } catch (error) {
        console.log("Error in user login:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
}

// register user function
const registerUser = async (req, res) => {
    // FIX: Changed 'name' to 'username' to match your schema
    const { username, password, email } = req.body; 
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8 || !validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Password is not strong enough (must be 8+ chars)" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            username: username, // FIX: Use the 'username' variable
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createTOKEN(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log("Error in user registration:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
}

 export { loginUser, registerUser };