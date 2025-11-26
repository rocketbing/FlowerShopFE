import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { MailOutlined, CheckCircleOutlined, ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { req } from "../utils/request";

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // 检查是否是重置密码链接（有 resetCode 和 verified 参数）
    const email = searchParams.get("email");
    const resetCode = searchParams.get("resetCode");
    const verified = searchParams.get("verified");
    const isResetLink = email && resetCode && verified === "true";


    // 请求重置密码邮件
    const onRequestReset = async (values) => {
        const response = await req("/auth/request-reset", "POST", values);
        if (response.success) {
            setIsSent(true);
        } else {
            message.error(response.message);
        }
    };

    // 设置新密码
    const onSetNewPassword = async (values) => {
        setLoading(true);
        try {
            const response = await req("/auth/reset-password", "POST", {
                email,
                resetCode,
                password: values.password,
            });
            if (response.success) {
                message.success("Password reset successfully!");
                navigate("/login");
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    // 如果是重置密码链接，显示新密码表单
    if (isResetLink) {
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
                        <CheckCircleOutlined
                            style={{
                                fontSize: 48,
                                color: "#52c41a",
                                marginBottom: 16,
                            }}
                        />
                        <Title level={2} style={{ marginBottom: 10, color: "#1a1a1a", fontWeight: 600 }}>
                            Set New Password
                        </Title>
                        <Paragraph style={{ color: "#666666", fontSize: 16 }}>
                            Please enter your new password below.
                        </Paragraph>
                    </div>

                    <Form
                        form={form}
                        name="newPassword"
                        onFinish={onSetNewPassword}
                        autoComplete="off"
                        size="large"
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: "Please enter your new password!" },
                                { min: 6, message: "Password must be at least 6 characters!" },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="New Password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("The two passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm New Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{ height: 42, backgroundColor: '#000', color: '#fff' }}
                            >
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <span style={{ color: "#666666", fontSize: 14 }}>Remember your password? </span>
                        <Link to="/login" style={{ color: "#1a1a1a", fontSize: 14, fontWeight: 500 }}>
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        );
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
            {isSent ? (
                <Card
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}
                >
                    <div style={{ marginBottom: 30 }}>
                        <CheckCircleOutlined
                            style={{
                                fontSize: 64,
                                color: "#52c41a",
                                marginBottom: 24,
                            }}
                        />
                        <Title level={2} style={{ marginBottom: 16, color: "#1a1a1a", fontWeight: 600 }}>
                            Check Your Email
                        </Title>
                        <Paragraph style={{ fontSize: 16, color: "#666666", marginBottom: 8 }}>
                            We've sent a password reset link to your email address.
                        </Paragraph>
                        <Paragraph style={{ fontSize: 14, color: "#666666", marginBottom: 24 }}>
                            Please check your inbox and click the link to reset your password. If you didn't receive the email, please check your spam folder.
                        </Paragraph>
                    </div>

                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/login")}
                        block
                        size="large"
                        style={{ height: 42, backgroundColor: '#000', color: '#fff' }}
                    >
                        Back to Login
                    </Button>

                    <div style={{ marginTop: 16, textAlign: "center" }}>
                        <Paragraph style={{ fontSize: 12, color: "#666666", margin: 0 }}>
                            Didn't receive the email?{" "}
                            <Link 
                                to="/reset-password" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsSent(false);
                                    form.resetFields();
                                }}
                                style={{ color: "#1a1a1a", fontWeight: 500 }}
                            >
                                Try again
                            </Link>
                        </Paragraph>
                    </div>
                </Card>
            ) : (
                <Card
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <Title level={2} style={{ marginBottom: 10, color: "#1a1a1a", fontWeight: 600 }}>
                            Reset Password
                        </Title>
                        <p style={{ color: "#666666", fontSize: 16 }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="resetPassword"
                        onFinish={onRequestReset}
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
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                style={{ height: 42, backgroundColor: '#000', color: '#fff' }}
                            >
                                Send Reset Link
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <span style={{ color: "#666666", fontSize: 14 }}>Remember your password? </span>
                        <Link to="/login" style={{ color: "#1a1a1a", fontSize: 14, fontWeight: 500 }}>
                            Back to Login
                        </Link>
                    </div>
                </Card>
            )}

        </div>
    );
};

export default ResetPassword;

