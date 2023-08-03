import React, { useEffect, useState } from "react";
import { Row, Col, InputGroup, FormControl } from "react-bootstrap";
import debounce from "lodash.debounce";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import { BiSearch } from "react-icons/bi";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Home.css";
import { useCallback } from "react";
import { auth, db } from "../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUserStore } from "../zustandCart/UserOperations";
import { GiCoinsPile } from "react-icons/gi";

const Home = ({
  productData,
  setProductData,
  categories,
  setCategories,
  filterData,
  setFilterData,
  pages,
  SetPages,
  noOfCardsPerPage,
}) => {
  const [theme] = useThemeHook();
  const [searchInput, setSearchInput] = useState("");
  const setUser = useUserStore((UserStore) => UserStore.setUser);

  async function getResponse() {
    const respro = await fetch("https://fakestoreapi.com/products").then(
      (res) => res.json()
    );

    const categ = fetch("https://fakestoreapi.com/products/categories").then(
      (res) => res.json()
    );
    const p = Array.from(
      { length: Math.ceil(respro.length / noOfCardsPerPage) },
      (_, index) => index + 1
    );
    console.log(p);
    SetPages(p);
    setCategories(await categ);
    setProductData(await respro);
    setFilterData(await respro.slice(0, noOfCardsPerPage));

    if (auth.currentUser) {
      console.log(auth.currentUser);
      const q = query(
        collection(db, "users"),
        where("id", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs[0].data());
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0].data();
        const data = { ...doc, id: querySnapshot.docs[0].id };
        console.log(data);
        setUser(data);
      }
    }
  }

  useEffect(() => {
    if (productData.length === 0) {
      getResponse();
    }
  }, []);

  const handleCategoryProduct = (cat) => {
    console.log(cat);
    const FilterCatItems = productData.filter((itm) => itm.category === cat);
    setFilterData(FilterCatItems);
  };

  const handlePagination = (p) => {
    const dataPerPage = productData.slice(
      (p - 1) * noOfCardsPerPage,
      noOfCardsPerPage * p
    );
    setFilterData(dataPerPage);
  };
  const debouncedFilter = useCallback(
    debounce((q) => {
      console.log(q);
      if (q === "") {
        setFilterData(filterData);
      } else {
        setFilterData(
          productData.filter((itm) =>
            itm.title.toLowerCase().includes(q.toLowerCase())
          )
        );
      }
    }, 500),
    []
  );
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    debouncedFilter(e.target.value);
  };
  return (
    <>
      <div style={{ margin: "20px " }}>
        <Row className="m-2" style={{ textAlign: "center" }}>
          <Col
            onClick={() =>
              setFilterData(productData.slice(0, noOfCardsPerPage))
            }
            className={`${
              theme
                ? "bg-dark-primary text-white rounded "
                : "bg-light-primary text-white rounded "
            }  m-2`}
          >
            All
          </Col>
          {categories.map((cat, i) => {
            return (
              <Col
                key={i}
                onClick={() => handleCategoryProduct(cat)}
                className={`${
                  theme
                    ? "bg-dark-primary text-white rounded "
                    : "bg-light-primary text-white rounded "
                }  m-2`}
              >
                {cat}
              </Col>
            );
          })}
        </Row>
        <Row className="justify-content-center">
          <Col
            xs={10}
            md={7}
            lg={6}
            xl={4}
            className="mb-3 mx-auto text-center"
          >
            <InputGroup className="mb-3">
              <InputGroup.Text
                className={
                  theme
                    ? "bg-black text-dark-primary"
                    : "bg-light text-light-primary"
                }
              >
                <BiSearch size="2rem" />
              </InputGroup.Text>
              <FormControl
                placeholder="Search"
                value={searchInput}
                onChange={handleSearch}
                className={
                  theme ? "bg-light-black text-light" : "bg-light text-black"
                }
              />
            </InputGroup>
          </Col>

          <Row className="justify-content-center ">
            {filterData.map((item, i) => {
              return <ProductCard data={item} key={i} />;
            })}
          </Row>
        </Row>
        <Row className="justify-content-center">
          {pages.map((p, i) => {
            return (
              <button
                key={i}
                className={theme ? "dark-pagi" : "light-pagi"}
                onClick={() => handlePagination(p)}
              >
                {p}
              </button>
            );
          })}
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default Home;
