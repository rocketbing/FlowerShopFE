import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, Typography, Tabs } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginAsync, googleLoginAsync, clearError, getUserInfoAsync } from "../store/auth";

const { Title } = Typography;

// Separate component for Google Login button - only rendered when GoogleOAuthProvider exists
// Using GoogleLogin component which returns credential (ID token) instead of access token
const GoogleLoginButton = ({ onSuccess, onError, loading }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          // credentialResponse.credential contains the ID token
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          } else {
            onError();
          }
        }}
        onError={() => {
          onError();
        }}
        useOneTap={false}
        text="continue_with"
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Check if Google Client ID is configured
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isGoogleLoginEnabled = !!googleClientId;

  // Listen for errors and display
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Listen for successful login, navigate to home or previous page
  useEffect(() => {
    if (isAuthenticated && user) {
      message.success("Login successful!");
      
      // Get the original destination from route guard, or default based on role
      const from = location.state?.from?.pathname;
      
      if (user.role === "admin") {
        // For admin, redirect to admin home or the original destination
        navigate(from || "/administration/homeAdmin", { replace: true });
      } else {
        // For regular users, redirect to the original destination or home
        navigate(from || "/home", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const onFinish = async (values) => {
    await dispatch(loginAsync(values));
  };

  const handleGoogleLoginSuccess = async (idToken) => {
    try {
      // Send the Google ID token to your backend
      const result = await dispatch(
        googleLoginAsync({ idToken: idToken })
      ).unwrap();
      
      message.success("Google login successful!");
      
      // Get the original destination from route guard, or default based on role
      const from = location.state?.from?.pathname;
      const userRole = result.user?.role;
      
      if (userRole === "admin") {
        navigate(from || "/administration/homeAdmin", { replace: true });
      } else {
        navigate(from || "/home", { replace: true });
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error(error || "Google login failed");
    }
  };

  const handleGoogleLoginError = () => {
    message.error("Google login failed. Please try again.");
  };

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  // Build tab items - only include Google Login tab if enabled
  const tabItems = [
    {
      key: "email",
      label: "Email Login",
      children: (
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "left" }}>
            <span className="a_link_underline" onClick={handleResetPassword}>Reset Password</span>
          </Form.Item>

          <Form.Item>
            <Button
              
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 42,backgroundColor: '#000', color: '#fff' }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  // Add Google Login tab only if enabled
  // GoogleLoginButton component will only render when GoogleOAuthProvider exists (via App.js)
  if (isGoogleLoginEnabled) {
    tabItems.push({
      key: "google",
      label: "Google Login",
      children: (
        <div>
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            loading={loading}
          />
        </div>
      ),
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={2} style={{ marginBottom: 10, color: "#1a1a1a", fontWeight: 600 }}>
            Welcome Back
          </Title>
          <p style={{ color: "#666666", fontSize: 16 }}>Login to your account</p>
        </div>

        <Tabs
          defaultActiveKey="email"
          items={tabItems}
        />

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <span style={{ color: "#666666", fontSize: 14 }}>Don't have an account? </span>
          <Link to="/register" style={{ color: "#1a1a1a", fontSize: 14, fontWeight: 500 }}>
            Sign up now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;

