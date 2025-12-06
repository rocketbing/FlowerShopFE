import React, { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Row, Col, Menu, Space, Avatar, Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutAsync } from "../../store/auth";
import { useSelector } from "react-redux";
import { showCartDrawer } from "../../store/cart";
import CartDrawer from "../CartDrawer";

const { Header, Content, Footer } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const { count } = useSelector((state) => state.cart);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAsync()).unwrap();
    navigate("/login");
  };
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);
  const handleMenuClick = (e) => {
    console.log("Menu clicked:", e.key);
    navigate(`/${e.key}`);
  };

  // Navigation menu items - 7 tabs evenly distributed
  const userNavMenuItems = [
    {
      key: "new-in",
      label: "NEW IN",
    },
    {
      key: "artificial-flower",
      label: "Artificial Flower",
      children: [
        {
          key: "categories/artificial-hydrangeas",
          label: "Artificial Hydrangeas",
        },
        {
          key: "categories/artificial-roses",
          label: "Artificial Roses",
        },
        {
          key: "categories/artificial-lilies",
          label: "Artificial Lilies",
        },
        {
          key: "categories/artificial-peonies",
          label: "Artificial Peonies",
        },
        {
          key: "categories/artificial-blossom",
          label: "Artificial Blossom",
        },
        {
          key: "categories/artificial-tulips",
          label: "Artificial Tulips",
        },
        {
          key: "categories/artificial-orchids",
          label: "Artificial Orchids",
        },
        {
          key: "categories/artificial-magnolia",
          label: "Artificial Magnolia",
        },
        {
          key: "categories/artificial-berries-dahlias",
          label: "Artificial Berries & Dahlias",
        },
        {
          key: "categories/artificial-wild-flowers",
          label: "Artificial Wild Flowers",
        },
      ],
    },
    {
      key: "artificial-greenery",
      label: "Artificial Greenery",
      children: [
        {
          key: "categories/artificial-eucalyptus",
          label: "Artificial Eucalyptus",
        },
        {
          key: "categories/artificial-foliage-leaves",
          label: "Artificial Foliage & Leaves",
        },
        {
          key: "categories/artificial-garland",
          label: "Artificial Garland",
        },
        {
          key: "categories/artificial-plants",
          label: "Artificial Plants",
        },
      ],
    },
    {
      key: "artificial-arrangement",
      label: "Artificial Arrangement",
      children: [
        {
          key: "categories/bridal-arrangement",
          label: "Bridal Arrangement",
        },
        {
          key: "categories/flower-bouquet",
          label: "Flower Bouquet",
        },
        {
          key: "categories/long-arrangement",
          label: "Long Arrangement",
        },
      ],
    },
    {
      key: "vases-urns",
      label: "Vases & Urns",
      children: [
        {
          key: "categories/metal-vase",
          label: "Metal Vase",
        },
        {
          key: "categories/plastic-vase",
          label: "Plastic Vase",
        },
        {
          key: "categories/glass-vase",
          label: "Glass Vase",
        },
      ],
    },
    {
      key: "decor-accessories",
      label: "Decor Accessories",
    },
    {
      key: "sales",
      label: "Sales",
    },
  ];
  const adminNavMenuItems = [
    {
      key: "administration/manage-products",
      label: "Manage Products",
    },
    {
      key: "administration/manage-orders",
      label: "Manage Orders",
    },
    {
      key: "administration/manage-users",
      label: "Manage Users",
    },
  ];
  return (
    <AntLayout>
      <style>
        {`
          .ant-menu-horizontal > .ant-menu-item::after,
          .ant-menu-horizontal > .ant-menu-submenu::after {
            border-bottom: none !important;
          }
          .ant-menu-horizontal > .ant-menu-item:hover,
          .ant-menu-horizontal > .ant-menu-submenu:hover {
            color: #121212 !important;
            transition: color 0.3s ease !important;
          }
          .ant-menu-horizontal > .ant-menu-item:hover::after,
          .ant-menu-horizontal > .ant-menu-submenu:hover::after {
            border-bottom: none !important;
            background: linear-gradient(to right, transparent 0%, #d9d9d9 50%, transparent 100%) !important;
            height: 2px !important;
            width: 100% !important;
            bottom: 0 !important;
            left: 0 !important;
            transform: none !important;
            transition: background 0.3s ease !important;
          }
        `}
      </style>
      <Header
        style={{
          background: "#f5f5f5",
          padding: "16px 24px",
          height: "auto",
          lineHeight: "normal",
          position: "relative",
        }}
      >
        {/* First Row: Logo and Actions */}
        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          {/* Logo/Company Name - col(12) */}
          <Col span={12}>
            <Link to={user?.role === "user" ? "/" : "/administration/homeAdmin"} style={{ textDecoration: "none" }}>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 600, 
                color: "#1a1a1a",
                letterSpacing: "-0.02em"
              }}>
                Faux Flower Supply
              </div>
            </Link>
          </Col>

          {/* Account and Cart - col(12) */}
          <Col span={12}>
            <Row justify="end" align="middle" gutter={16}>
              <Col>
                {isAuthenticated && user ? (
                  <Link to="/account">
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1a1a1a", cursor: "pointer" }}
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#d9d9d9", cursor: "pointer" }}
                    />
                  </Link>
                )}
              </Col>
              <Col>
                <div onClick={() => dispatch(showCartDrawer())} style={{ cursor: "pointer" }}>
                  <Badge count={count} showZero>
                    <Avatar
                      icon={<ShoppingCartOutlined />}
                      style={{ backgroundColor: "#1a1a1a", cursor: "pointer" }}
                    />
                  </Badge>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Second Row: Navigation Menu */}
        {user?.role === "user" && (
        <Row>
          <Col span={24}>
            <Menu
              mode="horizontal"
              items={userNavMenuItems}
              onClick={handleMenuClick}
              selectedKeys={[]}
              style={{
                borderBottom: "none",
                display: "flex",
                justifyContent: "space-around",
                fontWeight: 500,
                fontSize: 14,
                color: "#1a1a1a",
                backgroundColor: "#f5f5f5",
                marginTop: "16px",
              }}
              theme="light"
            />
          </Col>
        </Row>)}
        {user?.role === "admin" && (
          <Row>
            <Col span={12} offset={6}>
              <Menu
                mode="horizontal"
                items={adminNavMenuItems}
                onClick={handleMenuClick}
                selectedKeys={[]}
                style={{
                  borderBottom: "none",
                  display: "flex",
                  justifyContent: "space-around",
                  fontWeight: 500,
                  fontSize: 20,
                  color: "#1a1a1a",
                  backgroundColor: "#f5f5f5",
                  marginTop: "16px",
                }}
                theme="light"
              />
            </Col>
          </Row>
        )}
      </Header>

      <Content style={{ padding: "24px", minHeight: "calc(100vh - 120px)" }}>
        {/* This Outlet will render the child routes */}
        <Outlet />
      </Content>
      <Footer>
        <div style={{ textAlign: "center" }}>
          <p>Copyright © 2025 Faux Flower Supply. All rights reserved.</p>
        </div>
      </Footer>
      {/* Global Shopping Cart Drawer */}
      <CartDrawer />
    </AntLayout>
  );
};

export default Layout;

