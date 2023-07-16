import { getAuth } from "firebase/auth";
import React from "react";
import { Navigate } from "react-router-dom";

const RequiredAuth = ({ children }) => {
  const auth = getAuth();
  if (!auth.currentUser) {
    return <Navigate to="/sign-in" />;
  } else {
    console.log(auth.currentUser);
  }
  return children;
};

export default RequiredAuth;
