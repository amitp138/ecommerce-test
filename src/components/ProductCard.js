import React from "react";
import { Button, Card, Col } from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import { BsCartPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCartStore } from "../zustandCart/UserOperations";
const ProductCard = (props) => {
  let { id, title, price, image } = props.data;
  const [theme] = useThemeHook();

  const Addtocart = useCartStore((CartStore) => CartStore.ADD_TO_CART);
  return (
    <Col>
    <Card
      style={{ width: "18rem", height: "auto" }}
      className={`${
        theme ? "bg-light-black text-light" : "bg-lihgt text-black"
      } text-center p-0 overflow-hidden shadow mx-auto mb-4`}
    >
      <Link to={`/product-details/${id}`}>
        <div
          style={{
            background: "white",
            height: "15rem",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "inherit",
          }}
        >
          <div style={{ width: "9rem" }}>
            <Card.Img variant="top" src={image} className="img-fluid" />
          </div>
        </div>
      </Link>
      <Card.Body>
        <Card.Title
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Card.Title>
        <Card.Title>
          Rs. <span className="h3">{price}</span>
        </Card.Title>
        <Button
          onClick={() => {
            Addtocart(props.data);
          }}
          className={`${
            theme ? "bg-dark-primary text-black" : "bg-light-primary"
          } d-flex align-item-center m-auto border-0`}
        >
          <BsCartPlus size="1.8rem" />
          Add to cart
        </Button>
      </Card.Body>
    </Card>
    </Col>
  );
};

export default ProductCard;
