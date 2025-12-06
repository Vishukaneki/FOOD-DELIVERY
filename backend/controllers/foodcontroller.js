import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Add food item
const addFood = async (req, res) => {
  // We get the filename from the request. This is added by the multer middleware.
  let image_filename = `${req.file.filename}`;

  // Create a new food document using the Mongoose model
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    // Save the new document to the MongoDB database
    await food.save();
    res.json({ success: true, message: "Food Added Successfully" });
  } catch (error) {
    console.log(error);

    // If the database save fails, we should delete the uploaded image
    // to avoid having unused files on the server.
    fs.unlink(`uploads/${image_filename}`, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
    
    res.json({ success: false, message: "An error occurred" });
  }
};

// All food list
const listFood= async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred" });
  }
};
// Remove food item
// Remove food item
const removeFood = async (req, res) => {
    try {
        // 1. Find the food item to get its image filename
        const food = await foodModel.findById(req.body.id);

        // 2. CRITICAL: Check if the food item actually exists
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found." });
        }

        // 3. Delete the food item from the database FIRST
        await foodModel.findByIdAndDelete(req.body.id);

        // 4. If database deletion is successful, THEN delete the image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                // Log the error, but don't stop the response
                // The main goal (deleting from DB) was successful
                console.log("Error deleting file:", err);
            }
        });

        res.json({ success: true, message: "Food Deleted Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};
export { addFood , listFood, removeFood};