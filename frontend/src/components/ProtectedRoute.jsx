import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading label="Checking your session..." />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}