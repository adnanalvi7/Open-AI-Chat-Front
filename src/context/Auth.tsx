import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface User {
  api_key: string | null;
  created_at: string;
  email: string;
  id: number;
  name: string;
  role: null;
  status: null;
  updated_at: string;
  usage_limit: number | null;
  used_request: number | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  saveTokenToCookie: (token: string) => void;
  getTokenFromCookie: () => string | null;
  isAuthenticated?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  saveUserToCookie: (user: string) => void;
  getUserFromCookie: () => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  saveTokenToCookie: () => {},
  getTokenFromCookie: () => null,
  setUser: () => null,
  setLoading: () => false,
  setIsAuthenticated: () => false,
  getUserFromCookie: () => null,
  saveUserToCookie: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveTokenToCookie = (token: string) => {
    Cookies.set("authToken", token, { expires: 1 / 24, secure: true });
  };

  const getTokenFromCookie = () => {
    const token = Cookies.get("authToken");
    if (token) return token;
    return null;
  };

  const saveUserToCookie = (user: string) => {
    Cookies.set("currentUser", user, { expires: 1 / 24, secure: true });
  };

  const getUserFromCookie = (): User | null => {
    const user = Cookies.get("currentUser");
    if (user) return JSON.parse(user);
    return null;
  };

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("currentUser");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = getTokenFromCookie();
    const user = getUserFromCookie();
    if (token && user) {
      setIsAuthenticated(true);
      setUser(user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        getTokenFromCookie,
        saveTokenToCookie,
        isAuthenticated,
        setLoading,
        setUser,
        setIsAuthenticated,
        saveUserToCookie,
        getUserFromCookie,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
