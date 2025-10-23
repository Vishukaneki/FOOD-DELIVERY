import userModel from "../models/userModel.js";

/**
 * @desc    Add an item to the user's cart (atomic)
 */
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // 1. Create the atomic update operation
        // $inc increments 'cartData.itemId' by 1.
        // If 'itemId' doesn't exist, it's created and set to 1.
        const update = {
            $inc: { [`cartData.${itemId}`]: 1 }
        };

        // 2. Perform the single, atomic update
        const updatedUser = await userModel.findByIdAndUpdate(userId, update, { new: true });

        // 3. Check if a user was actually found and updated
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "Added to cart!" });

    } catch (error) {
        console.log("Error in add to cart:", error);
        res.status(500).json({ success: false, message: "Server error during adding to cart" });
    }
}

/**
 * @desc    Remove an item from the user's cart (atomic)
 */
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // 1. Define the atomic update to decrement
        const update = {
            $inc: { [`cartData.${itemId}`]: -1 }
        };

        // 2. Define a filter to prevent negative counts
        // This ensures we only update if the item count is greater than 0.
        const filter = {
            _id: userId,
            [`cartData.${itemId}`]: { $gt: 0 }
        };
        
        // 3. Perform the single, atomic, conditional update
        const updatedUser = await userModel.findOneAndUpdate(filter, update, { new: true });

        // 4. Check if anything was updated
        // If updatedUser is null, it means the filter failed (user not found or item count was 0).
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found or item not in cart." });
        }
        
        res.json({ success: true, message: "Removed from cart" });

    } catch (error) {
        console.log("Error in remove from cart:", error);
        res.status(500).json({ success: false, message: "Server error during removing from cart" });
    }
}

/**
 * @desc    Get the user's entire cart
 */
const getCart = async (req, res) => {
    try {
        // 1. Find the user
        let userData = await userModel.findById(req.body.userId);

        // 2. Check if user exists (prevents crash)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 3. Return the user's cartData
        res.json({ success: true, cartData: userData.cartData || {} }); // Send empty object if cartData is null

    } catch (error) {
        console.log("Error in get cart:", error);
        res.status(500).json({ success: false, message: "Server error during getting cart" });
    }
}

export { addToCart, removeFromCart, getCart };