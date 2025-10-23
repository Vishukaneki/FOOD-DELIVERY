import express from "express";
import { addFood } from "../controllers/foodcontroller.js";
const router = express.Router();
import multer from "multer"; // for handling file uploads
import { listFood } from "../controllers/foodcontroller.js";
import { removeFood } from "../controllers/foodcontroller.js";
// route to add food item
const foodRouter = express.Router();
// image storage engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
       return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({storage:storage});
foodRouter.post('/add', upload.single("image"),addFood);
foodRouter.get('/list', listFood);
foodRouter.post('/remove', removeFood);
export default foodRouter;