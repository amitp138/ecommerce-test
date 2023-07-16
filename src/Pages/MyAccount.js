import React from "react";
import { Container, Row, Col, Tab, Nav, Image, Button } from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import Heading from "../components/Heading";
import profilePix from "../images/profile-picture.png";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import "./my-account.css";
import OrderCard from "../components/OrderCard";
import { useUserStore } from "../zustandCart/CartOperations";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";

const MyAccount = () => {
  const userData = useUserStore((userStore) => userStore.user);
  const auth = getAuth();
  useEffect(() => {
    console.log(userData);
  }, []);
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const [theme] = useThemeHook();
  return (
    <Container className="py-5 mt-1">
      <Heading heading="My Account" />
      <Tab.Container defaultActiveKey="my-orders">
        <Row className="justify-content-evenly mt-4 p-1">
          <Col
            sm={3}
            className={`${
              theme ? "text-light bg-dark" : "text-black bg-light"
            } p-2 rounded h-100 mb-3 user-menu`}
          >
            <Row className="mb-3 py-2">
              <Col xs={3} className="pe-0">
                <Image
                  src={profilePix}
                  thumbnail
                  fluid
                  roundedCircle
                  className="p-0"
                />
              </Col>
              <Col xs={9} className="pt-1">
                <span>Hello,</span>

                <h4>{userData.name}</h4>
              </Col>
            </Row>
            <Nav variant="pills" className="flex-column">
              <Nav.Item className="mb-3">
                <Nav.Link eventKey="my-orders">
                  My Orders
                  <FaClipboardList size="1.4rem" />
                </Nav.Link>
                <Nav.Link eventKey="account-details">
                  Account Details
                  <FaUser size="1.4rem" />
                </Nav.Link>
                <Nav.Link eventKey="address">
                  Address
                  <IoLocationSharp size="1.4rem" />
                </Nav.Link>
                <Nav.Link eventKey="wallet">
                  Wallet
                  <GiWallet size="1.4rem" />
                </Nav.Link>
                <Link to="/" onClick={handleLogOut}>
                  <Button variant="danger" className="m-2">
                    Sign Out
                  </Button>
                </Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col
            sm={8}
            className={`${
              theme ? "text-light bg-dark" : "text-black bg-light"
            } p-2 rounded`}
          >
            <Tab.Content>
              <Tab.Pane eventKey="my-orders">
                <Heading heading="My Orders" size="h3" />
                {userData.orders?.map((order) => {
                  return (
                    <OrderCard
                      orderDate={order.orderDate}
                      orderId={order.transactionId}
                      title={order.title}
                      img={order.image}
                      deliveredDate={order.deliveredDate}
                    />
                  );
                })}
              </Tab.Pane>
              <Tab.Pane eventKey="account-details">
                <Heading heading="Account details" size="h3" />
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <Heading heading="Address" size="h3" />
              </Tab.Pane>
              <Tab.Pane eventKey="wallet">
                <Heading heading="Wallet" size="h3" />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default MyAccount;
