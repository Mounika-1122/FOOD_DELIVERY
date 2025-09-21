import React, { useState, useContext } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
// import { useStripe } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// console.log("PlaceOrder component mounted");
// console.log("Token:", token);

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, setCartItems, url, loading } =
    useContext(StoreContext);

  const navigate = useNavigate();

  // const stripe = useStripe();

  //store info. from form field
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target; //extract name and value
    setData((prev) => ({ ...prev, [name]: value })); //change the value and update with new value
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    console.log("placeOrder called");
    //  Check if user is logged in
    if (!token) {
      alert("You must be logged in to place an order");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });
    //  Check if cart is empty
    if (orderItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 50, // ✅ Added ₹50 delivery charge
    };

    console.log("Placing order:", orderData);

    try {
      //post request to the backend api where order is sent
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }, //sending an authentication token in request headers
        // (so the backend knows which user is placing the order).
      });

      if (response.data.success) {
        console.log("Order placed successfully:", response.data);
        setCartItems({});
        navigate("/myorders");

        // window.location.replace(sessionId); //Redirects the user to a new URL (sessionId)
      } else {
        console.error("Backend error:", response.data.error);
        alert("Error creating order: " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

   if (loading) {
    return <p>Loading...</p>; // wait until token & food_list are ready
  }

   // Render login message if not logged in
    if (!token) {
    return <p className="login-warning">Please log in to place an order.</p>;
  }
  console.log("Token at render:", token);

  

  useEffect(()=>{
    if(!token){
        navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  }, [token])
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>

        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />

        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>

        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
