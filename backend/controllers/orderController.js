import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// import Stripe from "stripe";


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
  // const frontend_url = "http://localhost:5174";

  try {
    console.log(`User ${req.userId} place order request: `,req.body);
    // creating a new order
    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment:true
    });

    // saving new order in DB
    await newOrder.save();

    // clearing user's cart data
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // const line_items = req.body.items.map((item) => ({
    //   price_data: {
    //     currency: "inr",
    //     product_data: {
    //       name: item.name,
    //     },
    //     unit_amount: item.price * 100, // price should be in paisa (INR smallest unit)
    //   },
    //   quantity: item.quantity,
    // }));

    // // Add delivery charges
    // line_items.push({
    //   price_data: {
    //     currency: "inr",
    //     product_data: {
    //       name: "Delivery Charges",
    //     },
    //     unit_amount: 5000, // ₹50 in paisa
    //   },
    //   quantity: 1,
    // });

    // // Create Stripe Checkout Session
    // const session = await stripe.checkout.sessions.create({
    //   line_items: line_items,
    //   mode: "payment",
    //   success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    //   cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    // });


    // return sessionId instead of session_url
    res.json({ success: true, message:"Order Successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error creating order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying order" });
  }
};

//user orders for payment

const userOrders= async (req, res) =>{
  try{
    console.log("userOrders called for userId:", req.userId);

    const orders=await orderModel.find({userId: req.userId});
    
    console.log("Found orders:", orders);
    res.json({success: true, data: orders});

  }catch(error){
    console.log(error);
    res.json({success:false, message:"Error"});

  }

}

//Listing orders for admin panel

const listOrders= async (req, res) =>{
  try{
    const orders= await orderModel.find({});
    res.json({success:true, data:orders})

  } catch(error){
      console.log(error);
      res.json({success: false, message:"Error"})
  }
}

//api for updating order status
const updateStatus = async (req, res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false, message:"Error"})
    }
}
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };


