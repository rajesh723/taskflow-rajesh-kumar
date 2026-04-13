import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: any) => {
  const { token, loading } = useContext(AuthContext);

  // 🛑 Wait until auth is restored
  if (loading) {
    return <p>Loading...</p>; // or spinner
  }

  // ❌ Only redirect AFTER loading
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;