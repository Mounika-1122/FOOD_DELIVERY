import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    cartData:{type:Object, default:{}}
},{minimize:false})
//Mongoose will remove ("minimize") empty objects from your documents 
// when saving them to MongoDB.

const userModel=mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
