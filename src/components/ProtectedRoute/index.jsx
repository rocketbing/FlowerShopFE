import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAppSelector } from "../../store/hooks";

/**
 * 保护需要认证的路由
 * 如果用户未登录,重定向到登录页面
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // 如果还在加载中,显示加载状态
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // 如果未认证,重定向到登录页面,并保存当前路径以便登录后返回
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * 保护需要管理员权限的路由
 * 如果用户未登录或不是管理员,重定向到相应页面
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // 如果还在加载中,显示加载状态
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // 如果未认证,重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果不是管理员,重定向到首页
  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

/**
 * 公共路由 - 已登录用户不应访问 (如登录、注册页面)
 * 如果用户已登录,重定向到首页
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  // 如果还在加载中,显示加载状态
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // 如果已登录,根据用户角色重定向到相应首页
  if (isAuthenticated) {
    // 对于已登录用户访问登录/注册页面,直接重定向到首页
    // 根据角色决定重定向目标
    if (user?.role === "admin") {
      return <Navigate to="/administration/homeAdmin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};

export { ProtectedRoute, AdminRoute, PublicRoute };

