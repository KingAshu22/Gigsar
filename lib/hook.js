import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const mobile = sessionStorage.getItem("mobile");
    const authExpiry = sessionStorage.getItem("authExpiry");

    if (
      mobile &&
      authExpiry &&
      !isNaN(authExpiry) &&
      Date.now() < parseInt(authExpiry, 10)
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return isAuthenticated;
};

export default useAuth;
