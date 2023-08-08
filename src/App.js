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
import Checkout from "./Pages/Checkout";
import RequiredAuth from "./Auth/RequiredAuth";
import { useState } from "react";

function App() {
  const [theme] = useThemeHook();
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [pages, SetPages] = useState([]);
  const [noOfCardsPerPage, setNoOfCardsPerPage] = useState(6);
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
            <Route
              exact
              path="/"
              element={
                <Home
                  productData={productData}
                  setProductData={setProductData}
                  categories={categories}
                  setCategories={setCategories}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  pages={pages}
                  SetPages={SetPages}
                  noOfCardsPerPage={noOfCardsPerPage}
                />
              }
            />
            <Route
              exact
              path="/my-account"
              element={
                <RequiredAuth>
                  <MyAccount />
                </RequiredAuth>
              }
            />
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route
              exact
              path="/product-details/:productId"
              element={<ProductDetails />}
            />
            <Route exact path="/cart" element={<Cart />} />
            <Route
              exact
              path="/checkout"
              element={
                <RequiredAuth>
                  <Checkout />
                </RequiredAuth>
              }
            />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
