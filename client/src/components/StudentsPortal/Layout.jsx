import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const StudentsCommonLayout = () => {
  return <div>
    <Header />
    <Outlet />
  </div>;
};

export default StudentsCommonLayout;
