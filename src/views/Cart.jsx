import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Typography, Row, Col, Space, Input, message } from "antd";
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateQuantity, removeItem, setDiscountCode, applyDiscount, clearDiscount } from "../store/cart";
import { req } from "../utils/request";

const { Text } = Typography;

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, total, discountCode, discountAmount, discountPercentage } = useAppSelector((state) => state.cart);
    const [inputDiscountCode, setInputDiscountCode] = useState(discountCode || "");
    const [discountRate, setDiscountRate] = useState(0);

    const columns = [
        {
            title: <span style={{ font: "11px Baskerville, serif", color: "#212326BF" }}>PRODUCT</span>,
            dataIndex: "product",
            key: "product",
            render: (text, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {record.image ? (
                            <img
                                src={record.image}
                                alt={text}
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
                        )}
                        <div>
                            <Text strong style={{ fontSize: 14 }}>
                                {text}
                            </Text>
                            <div style={{ marginTop: 4 }}>
                                {record.discountedPrice ? (
                                    <>
                                        <Text type="secondary" style={{ fontSize: 12, textDecoration: "line-through", color: "#8c8c8c", marginRight: "8px" }}>
                                            ${parseFloat(record.regularPrice || 0).toFixed(2)}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            ${parseFloat(record.discountedPrice || 0).toFixed(2)}
                                        </Text>
                                    </>
                                ) : (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        ${parseFloat(record.regularPrice || 0).toFixed(2)}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
            align: "left",
        },
        {
            title: <span style={{ font: "11px Baskerville, serif", color: "#212326BF" }}>QUANTITY</span>,
            dataIndex: "cartQuantity",
            key: "cartQuantity",
            width: 150,
            render: (cartQuantity, record) => {
                const itemId = record.id || record._id;
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Button
                            type="text"
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => {
                                if (cartQuantity > 1) {
                                    dispatch(updateQuantity({ itemId, cartQuantity: cartQuantity - 1 }));
                                } else {
                                    dispatch(removeItem(itemId));
                                }
                            }}
                        />
                        <span style={{ font: "11px Baskerville, serif", color: "#212326BF", width: 40, textAlign: "center", display: "inline-block" }}>
                            {cartQuantity}
                        </span>
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => {
                                dispatch(updateQuantity({ itemId, cartQuantity: cartQuantity + 1 }));
                            }}
                        />
                    </div>
                );
            },
            align: "center",
        },
        {
            title: <span style={{ font: "11px Baskerville, serif", color: "#212326BF" }}>TOTAL</span>,
            dataIndex: "total",
            key: "total",
            width: 120,
            render: (total, record) => {
                const price = parseFloat(record.discountedPrice || record.regularPrice || 0);
                const itemTotal = price * (record.cartQuantity || 1);
                return (
                    <Text strong style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
                        ${itemTotal.toFixed(2)}
                    </Text>
                );
            },
            align: "center",
        },
    ];

    const dataSource = items.map((item, index) => {
        const itemId = item.id || item._id;
        const price = parseFloat(item.discountedPrice || item.regularPrice || 0);
        return {
            key: itemId || index.toString(),
            id: itemId,
            product: item.name || item.title || "Product",
            cartQuantity: item.cartQuantity || 1,
            regularPrice: item.regularPrice || 0,
            discountedPrice: item.discountedPrice || null,
            image: item.image || item.images?.url || null,
            total: price * (item.cartQuantity || 1),
        };
    });

    const subtotal = parseFloat(total || 0);
    const discount = discountRate / 100 * subtotal;
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const tax = subtotalAfterDiscount * 0.13;
    const totalWithTax = subtotalAfterDiscount + tax;

    // 处理折扣码输入和应用
    const handleApplyDiscount = async () => {
        const code = inputDiscountCode.trim().toUpperCase();
        if (!code) {
            message.warning("Please enter a discount code");
            return;
        }
        
        try {
            const response = await req("/discount-codes/verify", "POST", { code, subtotal: subtotal.toFixed(2) });
            if (response.success) {
                setDiscountRate(response.data.discountValue);
                dispatch(setDiscountCode(code));
                message.success("Discount code applied!");
            } else {
                message.error(response.message || "Failed to apply discount code");
            }
        } catch (error) {
            console.log(error);
        }

        
    };

    const handleRemoveDiscount = () => {
        dispatch(clearDiscount());
        setInputDiscountCode("");
        message.info("Discount code removed");
    };

    return (
        <div style={{ width: "90%", margin: "0 auto", borderRadius: "10px", padding: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h1>Cart</h1>
                <span className="a_link_underline" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    Return to Shop
                </span>
            </div>
            {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                    <p style={{ marginTop: 16, color: "#8c8c8c" }}>Your cart is empty</p>
                    <span className="a_link_underline" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        Return to Shop
                    </span>
                </div>
            ) : (
                <>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        className="mt-5"
                        pagination={false}
                    />
                    <div style={{ marginTop: "40px", padding: "20px", borderTop: "1px solid #f0f0f0" }}>
                        <Row justify="end">
                            <Col span={8}>
                                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text>Subtotal:</Text>
                                        <Text>${subtotal.toFixed(2)}</Text>
                                    </div>
                                    {discountCode && (
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "#52c41a" }}>
                                            <Text style={{ color: "#52c41a" }}>
                                                Discount ({discountCode}):
                                            </Text>
                                            <Text style={{ color: "#52c41a" }}>
                                                -${discount.toFixed(2)}
                                            </Text>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Text>Tax (13%):</Text>
                                        <Text>${tax.toFixed(2)}</Text>
                                    </div>
                                    {/* discount code */}
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <Text style={{ minWidth: 120 }}>Discount Code:</Text>
                                        <Input
                                            placeholder="Enter discount code"
                                            value={inputDiscountCode}
                                            onChange={(e) => setInputDiscountCode(e.target.value.toUpperCase())}
                                            onPressEnter={handleApplyDiscount}
                                            style={{ flex: 1 }}
                                        />
                                        {discountCode ? (
                                            <Button
                                                type="text"
                                                danger
                                                onClick={handleRemoveDiscount}
                                                size="small"
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                type="default"
                                                onClick={handleApplyDiscount}
                                                size="small"
                                            >
                                                Apply
                                            </Button>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
                                        <Text strong style={{ fontSize: 16 }}>Total:</Text>
                                        <Text strong style={{ fontSize: 16 }}>CAD${totalWithTax.toFixed(2)}</Text>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </div>
    );
}