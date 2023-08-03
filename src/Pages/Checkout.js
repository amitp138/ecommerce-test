import React, { useState } from "react";
import PaymentForm from "./PaymentForm";
import PaymentConfirmation from "./PaymentConfirmation";
import PaymentStatus from "./PaymentStatus";
import { useCartStore } from "../zustandCart/UserOperations";
import { useUserStore } from "../zustandCart/UserOperations";

const Checkout = () => {
  const [step, setStep] = useState(1); // Tracks the current step of the payment process
  const [paymentData, setPaymentData] = useState(null); // Stores the payment data
  const totalPayment = useCartStore((CartStore) => CartStore.CartTotalPrice);
  const itemscart = useCartStore((CartStore) => CartStore.Cart);
  const AddOrder = useUserStore((UserStore) => UserStore.updateOrder);

  const handlePaymentSubmit = (data) => {
    // Simulate payment processing
    const options = {
      day: "numeric", // Display the day as a number
      month: "long", // Display the month as the full name
      year: "numeric", // Display the year as a number
    };
    const date = new Date();
    const futureDate = new Date(); // Create a new date object
    const oDate = date.toLocaleDateString("en-US", options);
    futureDate.setDate(date.getDate() + 2); // Add 2 days to the current date
    const delDate = futureDate.toLocaleDateString("en-US", options);
    const orderedProducts = {
      items: itemscart.map((obj) => ({
        ...obj,
      })),
      orderDate: oDate,
      deliveredDate: delDate,
      transactionId: data.transactionId,
    };

    setTimeout(() => {
      console.log(orderedProducts);
      AddOrder(orderedProducts);
      setPaymentData(data);

      setStep(2); // Move to the payment confirmation step
    }, 2000); // Simulating a delay of 2 seconds
  };

  const handleRetryPayment = () => {
    setStep(1); // Move back to the payment form step
    setPaymentData(null); // Reset payment data
  };

  return (
    <div className="Checkout">
      {step === 1 && (
        <PaymentForm onSubmit={handlePaymentSubmit} amount={totalPayment} />
      )}
      {step === 2 && <PaymentConfirmation paymentData={paymentData} />}
      {step === 3 && <PaymentStatus retryPayment={handleRetryPayment} />}
    </div>
  );
};

export default Checkout;
