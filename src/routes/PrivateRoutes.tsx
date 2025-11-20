import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoutes: React.FC = () => {
  const token = useAuthStore((state) => state.token);

  const isValidToken = (accessToken: string | null) => {
    return !!accessToken && accessToken.trim() !== "";
  };

  if (!isValidToken(token)) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;