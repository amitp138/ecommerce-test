import React from "react";
import "./Footer.css";
import { SocialIcon } from "react-social-icons";
const Footer = () => {
  return (
    <div className="bg-dark text-light text-center border">
      <span>
        <b>© 2002-2023, LazyAcs.com, Inc. or its affiliates</b>
        <div className="social-icons p-2">
          <b>contact me</b>
          <SocialIcon
            url="https://www.linkedin.com/in/amit-pandey-006b28240/"
            bgColor="#2867B2"
            fgColor="#fff"
            style={{ height: "30px", width: "30px", marginLeft: "10px" }}
          />
          <SocialIcon
            url="https://github.com/amitp138"
            bgColor="#333"
            fgColor="#fff"
            style={{ height: "30px", width: "30px", marginLeft: "10px"  }}
          />
          <SocialIcon
            url="mailto:amitpande1008@gmail.com"
            bgColor="#D44638"
            fgColor="#fff"
            style={{ height: "30px", width: "30px", marginLeft: "10px" }}
          />
        </div>
      </span>
    </div>
  );
};

export default Footer;
