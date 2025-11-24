import React from "react";
import { Card } from "antd";
import CartDrawer from "./CartDrawer";
import {showCartDrawer,addItem} from "../store/cart";
import { useAppDispatch } from "../store/hooks";



const CustomCard = ({ title, description, origianlPrice, salesPrice, imageUrl, imageAlt, product }) => {
  const dispatch = useAppDispatch();
  const handleAddToCart = () => {
    dispatch(showCartDrawer());
    dispatch(addItem({product, cartQuantity: 1}));

  };
  return (
    <div className="mb-5">
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: "200px" }}>
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        }
      >
      </Card>
      <div className="description">
          <p>{title} - {description}</p>
          {salesPrice ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#8c8c8c", marginRight: "8px" }}>
                $ {origianlPrice ? parseFloat(origianlPrice).toFixed(2) : "0.00"}
              </span>
              <span>$ {parseFloat(salesPrice).toFixed(2)}</span>
            </>
          ) : (
            <span>$ {origianlPrice ? parseFloat(origianlPrice).toFixed(2) : "0.00"}</span>
          )}
      </div>
      <div className="addToCart"><span onClick={handleAddToCart}>A D D &nbsp; T O &nbsp; C A R T</span></div>
    </div>


  );
};
export default CustomCard;
