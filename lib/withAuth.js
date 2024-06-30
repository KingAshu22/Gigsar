import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";
import useAuth from "./hook";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (isAuthenticated === false) {
        router.replace(
          `/sign-in?redirect_url=${encodeURIComponent(
            window.location.pathname
          )}`
        );
      } else if (isAuthenticated === true) {
        setLoading(false);
      }
    }, [isAuthenticated, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <HashLoader color="#dc2626" size={80} />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
