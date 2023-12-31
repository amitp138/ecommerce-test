import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Image,
} from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/high-res.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useUserStore } from "../zustandCart/UserOperations";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Firebase";
import profilePicture from "../images/profile-picture.png";
import { Storage } from "../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(null);
  const [theme] = useThemeHook();
  const navigate = useNavigate();
  const setUser = useUserStore((UserStore) => UserStore.setUser);
  const [image, setImage] = useState(profilePicture);
  const [imURL, setImgURL] = useState(null);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      console.log(URL.createObjectURL(e.target.files[0]));
      setImage(URL.createObjectURL(e.target.files[0]));
      setImgURL(e.target?.files[0]);
    }
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form);
    event.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    const firstname = form.firstName.value;
    const lastname = form.lastName.value;
    const email = form.email.value;
    if (username && password && firstname && lastname && email && number) {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          const name = firstname + " " + lastname;
          const storageRef = ref(Storage, `files/${name}`);
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
                  console.log("File available at", downloadURL);
                  const docRef = await addDoc(collection(db, "users"), {
                    id: user.uid,
                    username,
                    name,
                    email,
                    phone: number,
                    imageSrc: downloadURL,
                  });
                  console.log(docRef.id);
                  setUser({
                    id: docRef.id,
                    username,
                    name,
                    email,
                    phone: number,
                  });
                  navigate("/");
                }
              );
            }
          );
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
        });

      alert("user register");

      console.log(username, password, firstname, lastname, email, number);
    }
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mt-5">
        <Col
          xs={11}
          sm={10}
          md={8}
          lg={4}
          className={`p-4 rounded ${
            theme ? "text-light bg-dark" : "text-black bg-light"
          }`}
        >
          <h1
            className={`text-center border-bottom pb-3 ${
              theme ? "text-dark-primary" : "text-light-primary"
            }`}
          >
            Create Account
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-center mb-3">
                <Image
                  src={image}
                  alt="Profile Picture"
                  className="image-placeholder"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <Form.Control
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <Row>
              <Form.Group className="mb-3 col-lg-6">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 col-lg-6">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  required
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Username"
                minLength={3}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile number</Form.Label>
              <PhoneInput
                country={"in"}
                value={number}
                onChange={(phone) => setNumber(phone)}
                className="text-dark"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                minLength={6}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className={`${
                theme ? "bg-dark-primary text-black" : "bg-light-primary"
              } m-auto d-block`}
              disabled={loading}
              style={{ border: 0 }}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  &nbsp;Loading...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
