import React from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, List, Button, Typography, message } from "antd";
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { removeItem, updateQuantity, hideCartDrawer } from "../../store/cart";

const { Text } = Typography;

const CartDrawer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, isModalVisible,total } = useAppSelector((state) => state.cart);
  console.log(items);

  const handleClose = () => {
    dispatch(hideCartDrawer());
  };

  const handleViewCart = () => {
    navigate("/cart");
    dispatch(hideCartDrawer());
  };

  return (
    <Drawer
      title="Shopping Cart"
      placement="right"
      onClose={handleClose}
      open={isModalVisible}
      width={400}
      footer={
        items.length > 0 ? (
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Tax (13%):</Text>
              <Text>
                ${(parseFloat(total || 0) * 0.13).toFixed(2)}
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <Text strong>Total:</Text>
              <Text strong>
                ${(parseFloat(total || 0) * 1.13).toFixed(2)}
              </Text>
            </div>
            <Button
              type="default"
              block
              onClick={handleViewCart}
              style={{ font: "17px Baskerville, serif" }}
            >
              View Cart
            </Button>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <ShoppingCartOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
          <p style={{ marginTop: 16, color: "#8c8c8c" }}>Your cart is empty</p>
        </div>
      ) : (
        <List
          dataSource={items}
          style={{ paddingBottom: items.length > 0 ? "80px" : 0 }}
          renderItem={(item) => {
            const itemId = item.id || item._id;
            return (
              <List.Item
                style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <List.Item.Meta
                  avatar={
                    item.image || item.images?.url ? (
                      <img
                        src={item.image || item.images.url}
                        alt={item.name || item.title}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: "#f0f0f0",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ShoppingCartOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
                      </div>
                    )
                  }
                  title={
                    <Text strong style={{ fontSize: 14 }}>
                      {item.name || item.title || "Product"}
                    </Text>
                  }
                  description={
                    <div>
                      {item.discountedPrice ? (
                        <>
                          <Text type="secondary" style={{ fontSize: 12, textDecoration: "line-through", color: "#8c8c8c", marginRight: "8px" }}>
                            ${parseFloat(item.regularPrice || 0).toFixed(2)}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ${parseFloat(item.discountedPrice || 0).toFixed(2)}
                          </Text>
                        </>
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ${parseFloat(item.regularPrice || 0).toFixed(2)}
                        </Text>
                      )}
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                        <Button
                          type="text"
                          icon={<MinusOutlined />}
                          size="small"
                          onClick={() => {
                            if (item.cartQuantity > 1) {
                              dispatch(updateQuantity({ itemId, cartQuantity: item.cartQuantity - 1 }));
                            } else {
                              dispatch(removeItem(itemId));
                            }
                          }}
                        />
                        <Text style={{ minWidth: 30, textAlign: "center" }}>{item.cartQuantity}</Text>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => {
                            dispatch(updateQuantity({ itemId, cartQuantity: item.cartQuantity + 1 }));
                          }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          onClick={() => dispatch(removeItem(itemId))}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Drawer>
  );
};

export default CartDrawer;

