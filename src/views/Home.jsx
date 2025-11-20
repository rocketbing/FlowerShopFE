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
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;

