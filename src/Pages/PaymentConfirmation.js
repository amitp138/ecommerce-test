import React from "react";
import { Alert, Container } from "react-bootstrap";

const PaymentConfirmation = ({ paymentData }) => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h2>Payment Confirmation</h2>
        <p>Amount: {paymentData.amount}</p>
        <p>Transaction ID: {paymentData.transactionId}</p>
        <Alert variant="success">Thank you for your payment!</Alert>
      </div>
    </Container>
  );
};

export default PaymentConfirmation;
