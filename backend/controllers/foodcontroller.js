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
const removeFood = async (req, res) => {
  try {
    const food= await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Deleted Successfully" });
}
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred" });
  }
};
export { addFood , listFood, removeFood};