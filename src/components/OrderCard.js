import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";

const OrderCard = (props) => {
  const [theme] = useThemeHook();
  return (
    <Card
      className={`${
        theme ? "bg-light-black text-light" : "bg-light text-black"
      } m-2`}
      border={theme ? "warning" : "primary"}
    >
      <Card.Header>
        <b>{props.orderDate}</b>
        <small className="float-end">Order ID: {props.orderId}</small>
      </Card.Header>
      {props.order?.map((ord, i) => {
        return (
          <Row className="p-2" key={i}>
            <Col xs={3} sm={2}>
              <Card.Img variant="top" src={ord.image} />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{ord.title}</Card.Title>
                <Card.Text>
                  <Badge pill bg="success">
                    Delivery on {props.deliveredDate}
                  </Badge>
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

export default OrderCard;
