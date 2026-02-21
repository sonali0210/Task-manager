import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";

// export const AuthContext = createContext<any>(null);
interface AuthContextType {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
  sessionMessage: string;
  showMessage: (msg: string) => void;
  showSnackbar: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
  showError: (msg: string) => void;
  setLoading: (state: boolean) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    msg: string;
    type: "success" | "error" | "info"|"warning";
  }>({
    open: false,
    msg: "",
    type: "success",
  });

  const [loading, setLoading] = useState(false);

  const showMessage = (msg: string) => {
    setSnackbar({ open: true, msg, type: "success" });
  };

  const showError = (msg: string) => {
    setSnackbar({ open: true, msg, type: "error" });
  };

  const showSnackbar = (msg: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbar({ open: true, msg, type });
  };

  <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loading}
  >
    <CircularProgress color="inherit" />
  </Backdrop>;

  //   useEffect(() => {
  //   console.log("AuthContext token state changed:", token);
  // }, [token]);

  // const navigate = useNavigate();
  const [sessionMessage, setSessionMessage] = useState("");

  const login = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
    // setSessionMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setSessionMessage("Session expired. Please login again.");
  };

  // Auto-logout
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout();
        } else if (decoded.exp) {
          const timeout = decoded.exp * 1000 - Date.now();
          const timer = setTimeout(() => logout(), timeout);
          return () => clearTimeout(timer);
        }
      } catch {
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        sessionMessage,
        showMessage,
        showError,
        setLoading,
        loading,
        showSnackbar,
      }}
    >
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>

      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      
      </Backdrop> */}
    </AuthContext.Provider>
  );
};
