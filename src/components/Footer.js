import React from "react";
import "./Footer.css"
const Footer = () => {
  return (
   
    <div className="bg-dark text-light text-center border">
      <ul className="d-flex justify-content-center flex-wrap foot-list ">
        <li className="m-1">Conditions of Use & Sale</li>
        <li className="m-1">Privacy Notice</li>
        <li className="m-1"> Interest-Based Ads</li>
      </ul>
      <span>© 1996-2023, Amazon.com, Inc. or its affiliates</span>
    </div>
   
  );
};

export default Footer;
