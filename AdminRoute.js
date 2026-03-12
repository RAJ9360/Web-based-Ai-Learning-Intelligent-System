import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/dashboard" />;
}

export default AdminRoute;
