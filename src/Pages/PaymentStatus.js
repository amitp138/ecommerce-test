import React from "react";
import { Alert, Button, Container } from "react-bootstrap";

const PaymentStatus = ({ retryPayment }) => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h2>Payment Status</h2>
        <Alert variant="danger">Payment failed. Please try again.</Alert>
        <Button variant="primary" onClick={retryPayment}>
          Retry Payment
        </Button>
      </div>
    </Container>
  );
};

export default PaymentStatus;
