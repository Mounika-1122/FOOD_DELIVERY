import userModel from "../models/userModel.js";

//add items to user cart
//send token and itemId
const addToCart = async (req, res) => {
  try {
    //Find the user in DB using the ID from req.body
    console.log("started...");
    let userData = await userModel.findById(req.userId); //we get userId from middleware
    
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    console.log("found user");

    console.log(userData.cartData);
    //Get the existing cart data of that user
    //This is basically an object where keys = itemId and values = quantity.
    let cartData = await userData.cartData;

    //Check if the item (coming from frontend request) already exists in the cart.
    //If item not in cart, add it with quantity 1
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
      console.log("Incremented item count");
    }

    //If item already exists, increase its quantity by 1
    else {
      cartData[req.body.itemId] += 1;
      console.log("Added item");
    }
    console.log("CartData: ",userData.cartData);

    //Save the updated cart back into MongoDB.
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    console.log("Saved to DB");
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove items from user cart
//send token and itemId
const removeFromCart = async (req, res) => {
  try {
    console.log("Started removing item..")
    //Find user by ID
    let userData = await userModel.findById(req.userId);
    

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    console.log("Found user");

    //Get that user’s current cart
    let cartData = await userData.cartData;
    console.log("cartData: ",cartData);

    //Check if the item exists in cart and has quantity > 0
    if (cartData[req.body.itemId] > 0) {
      //Decrease its quantity by 1
      cartData[req.body.itemId] -= 1;
    }
    console.log("cartData: ",cartData);

    //Save the updated cart back into database
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    
    console.log("Saved to DB");

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//fetch user cart data
//send token
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); //from middleware

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { addToCart, removeFromCart, getCart };
