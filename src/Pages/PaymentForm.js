import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import rupay from "../images/rupay.png";
import visa from "../images/visa.png";

const PaymentForm = ({ onSubmit, amount }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const min = 10000; // Minimum 5-digit number
    const max = 99999; // Maximum 5-digit number

    const random = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(random);
    const paymentData = {
      cardNumber,
      expiryDate,
      cvv,
      amount,
      transactionId: random,
    };
    onSubmit(paymentData);
  };

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

  return (
    <Container className="d-flex justify-content-center ">
      <Card style={{ width: "400px", marginTop: "40px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2>Payment</h2>
          </div>
          <Form onSubmit={handleSubmit}>
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

            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit">
                Pay Now
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentForm;
