import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Hook to access auth context values (like current user, login, logout)
export const useAuth = () => {
  return useContext(AuthContext);
};