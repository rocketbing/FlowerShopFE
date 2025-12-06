import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Typography, Button, Space, Avatar, Divider, Row, Col } from "antd";
import { UserOutlined, MailOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutAsync } from "../store/auth";
import CustomCard from "../components/CustomCard";
import { getAllProductAsync } from "../store/products";
const { Title, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const productsState = useAppSelector((state) => state.products);
  const products = productsState?.products || { data: [], loading: false, error: null };

  useEffect(() => {
    dispatch(getAllProductAsync());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAsync()).unwrap();
    navigate("/login");
  };

  // If user is not logged in, show login/register options
  return (
    <div className="mx-auto">
      {products.loading ? (
        <div>Loading...</div>
      ) : products.error ? (
        <div>Error: {products.error}</div>
      ) : (<>
        <div className="new-arrivals mb-5">      <h1 className="text-center mb-5 mt-3">New Arrivals</h1>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {products.data && products.data.length > 0 ? (
              products.data.slice(0, 4).map((product) => (
                <Col key={product.id || product._id} span={6} className="gutter-row">
                  <CustomCard
                    title={product.name || product.title}
                    origianlPrice={product.regularPrice}
                    salesPrice={product.discountedPrice}
                    imageUrl={product.images.url}
                    imageAlt={product.images.alt}
                    description={product.description}
                    product={product}
                  />
                </Col>
              ))
            ) : (
              <div>No products found</div>
            )}
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} >
            <Button onClick={() => navigate("/categories/new-in")} style={{width: '200px',padding: '20px 20px'}}>V I E W &nbsp; A L L</Button>
          </div>
          </div>
          <div>
          <h1 className="text-center mb-5 mt-3">Sales</h1>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {products.data && products.data.length > 0 ? (
              products.data.slice(0, 4).map((product) => (
                <Col key={product.id || product._id} span={6} className="gutter-row">
                  <CustomCard
                    title={product.name || product.title}
                    origianlPrice={product.regularPrice}
                    salesPrice={product.discountedPrice}
                    imageUrl={product.images.url}
                    imageAlt={product.images.alt}
                    description={product.description}
                    product={product}
                  />
                </Col>
              ))
            ) : (
              <div>No products found</div>
            )}
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} >
            <Button onClick={() => navigate("/categories/sales")} style={{width: '200px',padding: '20px 20px'}}>V I E W &nbsp; A L L</Button>
          </div>
          </div>


      </>

      )}
    </div>
  );
};

export default Home;

