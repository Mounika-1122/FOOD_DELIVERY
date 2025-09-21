// main.jsx
import React from "react"; // ✅ must import React
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);



// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import StoreContextProvider from "./context/StoreContext";

// // import stripe
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// // create stripePromise (public key from Stripe dashboard)
// const stripePromise = loadStripe("your_stripe_publishable_key_here");

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <StoreContextProvider>
//       <Elements stripe={stripePromise}>
//         <App />
//       </Elements>
//     </StoreContextProvider>
//   </BrowserRouter>
// );
