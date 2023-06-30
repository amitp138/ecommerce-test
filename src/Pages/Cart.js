import React from "react";
import { Button, Container, Col, Row, Table } from "react-bootstrap";
import { useThemeHook } from "../GlobalComponents/ThemeProvider";
import { useCartStore } from "../zustandCart/CartOperations";
const Cart = () => {
  const [theme] = useThemeHook();
  const itemscart = useCartStore((CartStore) => CartStore.Cart);
  const cartTotal = useCartStore((CartStore) => CartStore.CartTotalPrice);
  const Addtocart = useCartStore((CartStore) => CartStore.ADD_TO_CART);
  const removeFromcart = useCartStore(
    (CartStore) => CartStore.REMOVE_FROM_CART
  );
  const removeItem = useCartStore((CartStore) => CartStore.REMOVE_ITEM);
  return (
    <Container className="py-4 mt-5">
      <h1
        className={`${
          theme ? "text-light" : "text-light-primary"
        } my-5 text-center`}
      >
        {itemscart.length === 0 ? "Your Cart is Empty" : "The Cart"}
      </h1>
      <Row className="justify-content-center">
        <Table
          responsive="sm"
          striped
          bordered
          hover
          variant={theme ? "dark" : "light"}
          className="mb-5"
        >
          <tbody>
            {itemscart.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div
                      style={{
                        background: "white",
                        height: "8rem",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ padding: ".5rem" }}>
                        <img
                          src={item.image}
                          style={{ width: "4rem" }}
                          alt={item.title}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <h6
                      style={{
                        whiteSpace: "nowrap",
                        width: "14rem",
                        overflow: "hidden",
                        textOverFlow: "ellipsis",
                        marginTop: "40px",
                      }}
                    >
                      {item.title}
                    </h6>
                  </td>
                  <td>
                    <h6 style={{ marginTop: "40px" }}>Rs. {item.price}</h6>
                  </td>
                  <td>
                    <h6 style={{ marginTop: "40px" }}>
                      Quantity ({item.quantity})
                    </h6>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        removeFromcart(item);
                      }}
                      style={{ marginTop: "40px" }}
                      className="ms-2"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => {
                        Addtocart(item);
                      }}
                      style={{ marginTop: "40px" }}
                      className="ms-2"
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      style={{ marginTop: "40px" }}
                      onClick={() => {
                        removeItem(item);
                      }}
                      className="ms-2"
                    >
                      Remove Item
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {itemscart.length > 0 && (
          <Row
            className={`${
              theme ? "bg-light-black text-light" : "bg-light text-balck"
            } justify-content-center w-100`}
          >
            <Col className="py-2">
              <h4>Total Price: Rs. {cartTotal}</h4>
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default Cart;
