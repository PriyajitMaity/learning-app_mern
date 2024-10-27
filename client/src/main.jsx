import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import { StrictMode } from "react";
import AdminProvider from "./context/admin-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
       <AdminProvider>
        <StudentProvider>
        <App />
        </StudentProvider>
       </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
