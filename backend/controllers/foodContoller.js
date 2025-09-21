import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from 'fs'; //importing file system, which is pre built in node.js

//add food item

const addFood= async (req, res) =>{
    let image_filename=`${req.file.filename}`;

    const food=new foodModel({
        name:req.body.name,
        description: req.body.description,
        price:req.body.price,
        category: req.body.category,
        image: image_filename //stores name of the file into DB
    })
    try{
        await food.save(); //food item will be saved in database
        res.json({success:true, message:"Food added"})
    }catch(error){
        console.log(error)
        res.json({success: false, message:"Error"})

    }
}

//all food list 

const listFood= async (req, res) =>{
    try{
        //{} → means empty filter, so it matches all documents.
        const foods= await foodModel.find({});
        res.json({success:true, data:foods})

    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
        }

}

//remove food item

const removeFood= async(req, res)=>{
    try{
        console.log(req.body);
        
        //find the food model using the id
        const food=await foodModel.findById(req.body.id);
        console.log(food);
        
        //deletes from the folder called "uploads"
        //Syntax: .unlink(path, callback)
        //empty callback, since you don’t need to do anything after deletion.
        fs.unlink(`uploads/${food.image}`,()=>{})

        //deletes in DB
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food Removed"});

    }catch(error){
        console.log(error);
        res.json({success: false, message:"Error"})
    }

}

export {addFood, listFood, removeFood}