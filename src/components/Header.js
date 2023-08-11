import React, { useContext, useState, useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { BiSun, BiMoon, BiCart } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useCartStore, useUserStore } from "../zustandCart/UserOperations";
import { ThemeContext } from "../GlobalComponents/ThemeProvider";

const Header = () => {
  const { theme, setThemeMode } = useContext(ThemeContext);
  const [darkMode, setDarkMode] = useState(theme);
  const totalItems = useCartStore((CartStore) => CartStore.CartItemsQuantity);
  const userData = useUserStore((userStore) => userStore.user);

  useEffect(() => {
    setThemeMode(darkMode);
  }, [darkMode]);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant={darkMode ? "dark" : "light"}
      className={
        darkMode ? "bg-light-black border-bottom" : "bg-light border-bottom"
      }
      style={{ width: "100%", position: "fixed", zIndex: 100 }}
    >
      <Container>
        <Nav.Link
          as={Link}
          to="/"
          className={`nav-link ${
            darkMode ? "text-dark-primary" : "text-light-primary"
          }`}
        >
          <h3 style={{ margin: "0" }}>
            <b> TrendBud</b>
          </h3>
        </Nav.Link>

        <Nav className="ms-auto d-flex flex-row justify-content-between align-items-center">
          <Nav.Link
            as={Link}
            to="/sign-in"
            className={`nav-link ${
              darkMode ? "text-dark-primary" : "text-light-primary"
            }`}
          >
            <h4 style={{ margin: "0 10px 0 0" }}>SignIn</h4>
          </Nav.Link>

          <Nav.Link
            onClick={() => setDarkMode(!darkMode)}
            className={darkMode ? "text-dark-primary" : "text-light-primary"}
          >
            {darkMode ? <BiSun size="1.7rem" /> : <BiMoon size="1.7rem" />}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/cart"
            className={`${
              darkMode ? "text-dark-primary" : "text-light-primary"
            } d-flex align-items-center`}
          >
            <BiCart size="2rem" />
            <span style={{ position: "relative", left: "-21px", top: "-18px" }}>
              {totalItems}
            </span>
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/my-account"
            className={`nav-link ${
              darkMode ? "text-dark-primary" : "text-light-primary"
            }`}
          >
            {userData.imageSrc ? (
              <img
                src={userData.imageSrc}
                alt="User Profile"
                style={{
                  width: "1.8rem",
                  height: "1.8rem",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <>
                <VscAccount size="1.8rem" />{" "}
              </>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
