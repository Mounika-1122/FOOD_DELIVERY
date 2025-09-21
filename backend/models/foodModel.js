import mongoose from "mongoose";

//mongoose.Schema is a class (provided by Mongoose)
//used to create a new instance of that class
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

//if model already there, it'll be used or new one will be created  named "food"
const foodModel= mongoose.models.food || mongoose.model("food",foodSchema);
export default foodModel;