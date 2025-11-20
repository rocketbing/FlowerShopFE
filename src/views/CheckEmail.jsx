import React, { useEffect } from "react";
import { Card, Typography, Button, Space, message } from "antd";
import { MailOutlined, CheckCircleOutlined, ReloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resendVerificationEmailAsync, clearError } from "../store/auth";

const { Title, Paragraph, Text } = Typography;

const CheckEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  // Get email address from URL params or location state
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || location.state?.email || "Your email";

  // Listen for errors and display
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleResendEmail = async () => {
    const result = await dispatch(resendVerificationEmailAsync(email));
    if (resendVerificationEmailAsync.fulfilled.match(result)) {
      message.success("Verification email has been resent. Please check your inbox.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

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
        <div style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 24 }}>
            <MailOutlined
              style={{
                fontSize: 64,
                color: "#1a1a1a",
                marginBottom: 16,
              }}
            />
          </div>
          <CheckCircleOutlined
            style={{
              fontSize: 48,
              color: "#52c41a",
              marginBottom: 16,
            }}
          />
          <Title level={2} style={{ marginBottom: 16, color: "#1a1a1a", fontWeight: 600 }}>
            Please Check Your Email
          </Title>
          <Paragraph style={{ fontSize: 16, color: "#666666", marginBottom: 8 }}>
            We've sent a verification email to the following address:
          </Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
              color: "#1a1a1a",
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            {email}
          </Text>
          <Paragraph style={{ fontSize: 14, color: "#666666", marginBottom: 8 }}>
            Please click the verification link in the email to activate your account
          </Paragraph>
          <Paragraph style={{ fontSize: 14, color: "#666666", marginBottom: 24 }}>
            If you didn't receive the email, please check your spam folder or try resending
          </Paragraph>
        </div>

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleResendEmail}
            loading={loading}
            block
            size="large"
            style={{ height: 42 }}
          >
            Resend Verification Email
          </Button>
          
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToLogin}
            block
            size="large"
            style={{ height: 42 }}
          >
            Back to Login
          </Button>
        </Space>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
          <Paragraph style={{ fontSize: 12, color: "#666666", margin: 0 }}>
            Email not delivered? Please verify your email address is correct, or{" "}
            <Link to="/register" style={{ color: "#1a1a1a", marginLeft: 4, fontWeight: 500 }}>
              register again
            </Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default CheckEmail;

