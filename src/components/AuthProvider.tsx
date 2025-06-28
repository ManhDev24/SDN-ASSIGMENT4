import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getCurrentUser } from "@/store/slices/authSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !token) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch {
          localStorage.removeItem("token");
        }
      }
    };

    checkAuth();
  }, [dispatch, token]);

  return <>{children}</>;
};

export default AuthProvider;
