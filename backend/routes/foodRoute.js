import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodContoller.js";
import multer from "multer"; //Node.js middleware for handling file uploads, for uploading imgs,pfps..


const foodRouter=express.Router();

//image storage engine

//This tells Multer: “store uploaded files on my computer’s disk” 
// (in a folder you choose).
const storage=multer.diskStorage({
    destination:"uploads", //This is the folder where uploaded files will be saved.
    filename:(req,file,cb)=>{ //This decides the file name to use when saving.
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

//Creates the actual upload middleware you’ll use in routes.
const upload=multer({storage:storage})

//Expect one file in the request.
foodRouter.post("/add",upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);




export default foodRouter;