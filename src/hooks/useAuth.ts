import { useAppSelector } from "./redux";

export const useAuth = () => {
  const { user, token, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && user.admin);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
  };
};
