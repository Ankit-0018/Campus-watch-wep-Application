import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/signIn", { replace: true });
      } else {
        setChecking(false); // done checking auth
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading || checking) {
    return <p>Loading...</p>; // don't show children until auth is confirmed
  }

  return <>{children}</>;
};

export default AuthGuard;
