import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Space, Avatar, Divider } from "antd";
import { UserOutlined, MailOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutAsync } from "../store/auth";

const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAsync()).unwrap();
    navigate("/login");
  };

  // If user is not logged in, show login/register options
  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Title level={2} style={{ marginBottom: 20, color: "#1890ff" }}>
            Welcome to Flower Shop
          </Title>
          <p style={{ color: "#8c8c8c", marginBottom: 30, fontSize: 16 }}>
            Please login or register to continue
          </p>
          <Space size="middle">
            <Link to="/login">
              <Button type="primary" size="large">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="large">Register</Button>
            </Link>
          </Space>
        </Card>
      </div>
    );
  }

  // User is logged in, display user information
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Card
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1890ff",
                marginBottom: 20,
              }}
            />
            <Title level={2} style={{ marginBottom: 10, color: "#1890ff" }}>
              Welcome Back!
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Here is your account information
            </Text>
          </div>

          <Divider />

          <div style={{ padding: "20px 0" }}>
            <Card
              style={{
                backgroundColor: "#f5f5f5",
                border: "none",
              }}
            >
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <UserOutlined
                      style={{
                        fontSize: 20,
                        color: "#1890ff",
                      }}
                    />
                    <Text strong style={{ fontSize: 16 }}>
                      Username:
                    </Text>
                  </div>
                  <Text style={{ fontSize: 16 }}>{user.name || user.username || "Not set"}</Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <MailOutlined
                      style={{
                        fontSize: 20,
                        color: "#1890ff",
                      }}
                    />
                    <Text strong style={{ fontSize: 16 }}>
                      Email:
                    </Text>
                  </div>
                  <Text style={{ fontSize: 16 }}>{user.email || "Not set"}</Text>
                </div>
              </Space>
            </Card>
          </div>

          <Divider />

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              size="large"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;

