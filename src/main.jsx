// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./components/context/UserContext.jsx";
import { CartProvider } from "./components/context/CartContext.jsx";
import { OrderProvider } from "./components/context/OrderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <OrderProvider>
        <App />
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);
