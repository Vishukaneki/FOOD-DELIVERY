import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // <-- SUGGESTION 1: Added unique
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Map,        // <-- SUGGESTION 2: Changed from Object to Map
        of: Number,     // <-- Specifies that values in the map are Numbers
        default: {},
    }
}, { minimize: false }); // {minimize: false} is correct to keep empty cartData

// CRITICAL FIX: Changed mongoose.models.user to mongoose.models.User
const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;