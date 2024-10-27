import React, { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RouteGaurd = ({ authenticated, user, element }) => {
    // console.log(authenticated, user, "useruser");
  const location = useLocation();
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to={"/auth"} />;
  }

  if (authenticated && user?.role !== "admin" && (location.pathname.includes("admin") ||
    location.pathname.includes("/auth"))
  ) {
    return <Navigate to={"/home"} />;
  }

  if (authenticated && user.role === "admin" && !location.pathname.includes("admin")) {
    return <Navigate to={"/admin"} />;
  }

  return <Fragment>{element}</Fragment>;
};

export default RouteGaurd;
