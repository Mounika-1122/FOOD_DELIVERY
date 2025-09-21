import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config.js';
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userModel from "./models/userModel.js";
//app config
const app=express();
const port=4000;

//middleware-- basically sits b/w req and response
app.use(express.json()); //parses the frontend data, so that express understands
app.use(cors()); //allows frontend to interact with backend API safely


//DB connection
connectDB();


//api endpoint
app.use("/api/food",foodRouter);

//express.static is a built-in middleware in Express.
//It serves static files (like images, CSS, JS) from a folder.

//"Whenever a request comes to /images/..., 
// go look inside the uploads folder and serve the file directly."
app.use("/images",express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

app.use("/api/order", orderRouter);


app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
})


