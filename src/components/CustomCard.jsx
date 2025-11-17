import React, { useState } from "react";
import { Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import whiteFlower01 from "../images/whiteFlower01.jpg";
import whiteFlower02 from "../images/whiteFlower02.jpg";
const { Meta } = Card;
const CustomCard = ({ title, origianlPrice, salesPrice }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Card
      hoverable
      style={{ width: 300, position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cover={
        <div style={{ position: "relative", height: "200px" }}>
          <img
            src={whiteFlower01}
            alt="flower1"
            draggable={false}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: hovered ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
          <img
            src={whiteFlower02}
            alt="flower2"
            draggable={false}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
        </div>
      }
    >
      {hovered && (
        <SearchOutlined
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 22,
            color: "white",
            cursor: "pointer",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.3)",
            transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)",
          }}
        />
      )}

      <Meta
        title={<div style={{ whiteSpace: "normal" }}>{title}</div>}
        description={salesPrice}
      />
    </Card>
  );
};
export default CustomCard;
