import React from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logoutAsync, getUserInfoAsync } from "../store/auth";
import { Button, Row, Col } from "antd";

export default function Account() {
    const { user, loading } = useAppSelector((state) => state.auth);
    const username = user?.username || user?.name || user?.data?.username || user?.data?.name || "";
    const homeAddress = user?.data?.homeAddress;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        dispatch(getUserInfoAsync());
    }, [dispatch]);
    
    if (loading) {
        return (
            <div>
                <h1 style={{ textAlign: "center", margin: "0 0 10" }}>Account Page</h1>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 style={{ textAlign: "center", margin: "0 0 10" }}>Account Page</h1>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => { dispatch(logoutAsync()); navigate("/login") }}>
                    <span style={{ color: "#1A1B18", font: "16px Arial, sans-serif" }}>Log out</span>
                </Button>
            </div>
            <Row>
                <Col span={6}>
                    <h2>Order History</h2>
                </Col>
                <Col span={6}>

                </Col>
                <Col span={6}>

                </Col>
                <Col span={6}>
                    <h2>Account Details</h2>
                    <p>{username}</p>
                    {homeAddress && homeAddress.street ? (
                        <>
                            <p>{homeAddress.street}</p>
                            <p>{homeAddress.city} {homeAddress.state} {homeAddress.zipCode}</p>
                            <p>{homeAddress.country}</p>
                            <div style={{ cursor: "pointer" }} onClick={() => navigate("/addresses")}>
                                <span className="view-addresses-btn">View Addresses</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>No addresses found</p>
                            <div style={{ cursor: "pointer" }} onClick={() => navigate("/addresses")}>
                                <span className="view-addresses-btn">View Addresses (0)</span>
                            </div>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}