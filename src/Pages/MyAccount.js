import React from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Image,
  Button,
  Form,
} from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import Heading from "../components/Heading";
import profilePix from "../images/profile-picture.png";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GiWallet } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import "./my-account.css";
import OrderCard from "../components/OrderCard";
import { useUserStore } from "../zustandCart/UserOperations";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import rupay from "../images/rupay.png";
import visa from "../images/visa.png";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Storage, db } from "../Firebase";

const MyAccount = () => {
  const userData = useUserStore((userStore) => userStore.user);
  const updateAddress = useUserStore((UserStore) => UserStore.updateAddress);
  const updateWallet = useUserStore((uStore) => uStore.updateWallet);
  const auth = getAuth();
  const [username, setUsername] = useState(userData.username);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [cardNumber, setCardNumber] = useState(userData.wallet.cardNumber);
  const [expiryDate, setExpiryDate] = useState(userData.wallet.expiry);
  const [cvv, setCvv] = useState(userData.wallet.cvv);
  const setUser = useUserStore((UserStore) => UserStore.setUser);
  const [image, setImage] = useState(
    userData.imageSrc ? userData.imageSrc : profilePix
  );
  const [imURL, setImgURL] = useState(null);
  const [address, setAddress] = useState({
    street: userData.address.street,
    city: userData.address.city,
    state: userData.address.state,
    pincode: userData.address.pincode,
  });

  const formatCardNumber = (value) => {
    // Remove any non-numeric characters
    let formattedValue = value.replace(/\D/g, "");
    // Insert '-' after every 4 characters
    formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1-");
    // Limit the length to 16 characters
    formattedValue = formattedValue.slice(0, 19);
    setCardNumber(formattedValue);
  };

  const formatExpiryDate = (value) => {
    // Remove any non-numeric characters
    let formattedValue = value.replace(/\D/g, "");
    // Add '/' after the second character
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }
    // Limit the length to 7 characters (MM/YYYY)
    formattedValue = formattedValue.slice(0, 7);
    setExpiryDate(formattedValue);
  };

  const validateCvv = (value) => {
    // Remove any non-numeric characters
    const formattedValue = value.replace(/\D/g, "");
    // Limit the length to 3 characters
    setCvv(formattedValue.slice(0, 3));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      console.log(URL.createObjectURL(e.target.files[0]));
      setImage(URL.createObjectURL(e.target.files[0]));
      setImgURL(e.target?.files[0]);
    }
  };
  const handlePersonalDetails = async (e) => {
    const form = e.target;
    console.log(e.target[0]);
    e.preventDefault();
    const username = form[1].value;
    const name = form[2].value;
    const email = form[3].value;
    const number = form[4].value;
    console.log(username, name, email, number);
    try {
      // ... (existing code before the check for image change)

      if (image !== userData.imageSrc) {
        // The image has changed. Upload the new image and get the download URL.
        const storageRef = ref(Storage, `files/newImage/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, imURL);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(progress);
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                // Update the user data with the new image URL (downloadURL).
                const collectionRef = collection(db, "users");
                const q = query(
                  collectionRef,
                  where("id", "==", auth.currentUser.uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                  const docRef = doc(db, "users", querySnapshot.docs[0].id);
                  await updateDoc(docRef, {
                    username,
                    name,
                    email,
                    phone: number,
                    imageSrc: downloadURL, // Save the download URL as imageSrc.
                  });
                  setUser({
                    id: docRef.id,
                    username,
                    name,
                    email,
                    phone: number,
                    imageSrc: downloadURL, // Also update the imageSrc in the local state.
                  });
                } else {
                  console.log("Document not found!");
                }
              }
            );
          }
        );
      } else {
        // The image hasn't changed. Update the user data with the existing image URL.
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = doc(db, "users", querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            username,
            name,
            email,
            phone: number,
            imageSrc: image, // Save the existing image URL as imageSrc.
          });
          setUser({
            id: docRef.id,
            username,
            name,
            email,
            phone: number,
            imageSrc: image, // Also update the imageSrc in the local state.
          });
        } else {
          console.log("Document not found!");
        }
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };
  const handleAddress = async (e) => {
    const form = e.target;
    console.log(e.target[0].value);
    e.preventDefault();
    const address = {
      street: form[0].value,
      city: form[1].value,
      state: form[2].value,
      pincode: form[3].value,
    };
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(docRef, { Address: address });
        updateAddress(address);
      } else {
        console.log("Document not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleWallet = async (e) => {
    const form = e.target;
    console.log(e.target[0].value);
    e.preventDefault();
    const wallet = {
      cardNumber: e.target[0].value,
      expiry: e.target[1].value,
      cvv: e.target[2].value,
    };
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(docRef, { Wallet: wallet });
        updateWallet(wallet);
      } else {
        console.log("Document not found!");
      }
    } catch (error) {
      console.log(error);
    }
  };
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
    <Container className="py-2">
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
                  src={userData.imageSrc ? userData.imageSrc : profilePix}
                  roundedCircle
                  className="p-0"
                  style={{ width: "70px", height: "70px" }}
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
              <Tab.Pane
                eventKey="my-orders"
                style={{
                  overflowY: "auto",
                  height: "70vh",
                  overflowX: "hidden",
                }}
              >
                <Heading heading="My Orders" size="h3" />
                {userData.orders?.map((order, i) => {
                  return (
                    <OrderCard
                      orderDate={order.orderDate}
                      orderId={order.transactionId}
                      order={order.items}
                      deliveredDate={order.deliveredDate}
                      key={i}
                    />
                  );
                })}
              </Tab.Pane>
              <Tab.Pane eventKey="account-details">
                <Heading heading="Account details" size="h3" />
                <Form
                  onSubmit={handlePersonalDetails}
                  className="d-flex flex-md-row flex-column justify-content-evenly align-items-center m-0"
                >
                  <div className="d-flex flex-column ">
                    <Image
                      src={image}
                      alt="User Profile"
                      style={{
                        width: "200px",
                        height: "220px",
                        margin: "10px",
                      }}
                    />
                    <label className="btn btn-primary" htmlFor="profileImage">
                      Edit photo
                      <AiOutlineEdit size="1.4rem" />
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="d-flex flex-column ">
                    <Form.Group controlId="formUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button variant="primary" className="m-2" type="submit">
                        Save
                      </Button>
                    </div>
                  </div>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="address">
                <Heading heading="Address" size="h3" />
                <Form onSubmit={handleAddress}>
                  <Form.Group controlId="formStreet">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPincode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center">
                    <Button variant="primary" className="m-2" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="wallet">
                <Heading heading="Wallet" size="h3" />
                <Form onSubmit={handleWallet}>
                  <Form.Group controlId="cardNumber">
                    <Form.Label>
                      Card Number:
                      <img src={rupay} alt="rupay card" />
                      <img src={visa} alt="visa card" />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={cardNumber}
                      onChange={(e) => formatCardNumber(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="expiryDate">
                    <Form.Label>Expiry Date:</Form.Label>
                    <Form.Control
                      type="text"
                      value={expiryDate}
                      onChange={(e) => formatExpiryDate(e.target.value)}
                      placeholder="MM/YYYY"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="cvv">
                    <Form.Label>CVV:</Form.Label>
                    <Form.Control
                      type="text"
                      value={cvv}
                      onChange={(e) => validateCvv(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center">
                    <Button variant="primary" className="m-2" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default MyAccount;
