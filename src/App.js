import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useThemeHook } from "./GlobalComponents/ThemeProvider";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";
import SignIn from "./Pages/SignIn";
import Register from "./Pages/Register";
import MyAccount from "./Pages/MyAccount";

function App() {
  const [theme] = useThemeHook();
  return (
    <>
      <main
        className={theme ? "bg-black" : "bg-light-2"}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <Router>
          <div style={{ height: "50px" }}>
            <Header />
          </div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/my-account" element={<MyAccount />} />
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route
              exact
              path="/product-details/:productId"
              element={<ProductDetails />}
            />
            <Route exact path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
