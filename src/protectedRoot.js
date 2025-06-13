import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./authprovider";
import Loading from "./components/addLoadingElement";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return user ? <Outlet /> : <Navigate to="/authpage" replace />;
};

export default ProtectedRoute;
