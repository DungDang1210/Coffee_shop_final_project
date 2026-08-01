import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({
  admin,
  children
}) {

  if (!admin || admin.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
