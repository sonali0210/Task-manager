import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


const theme = createTheme({
  palette:{
    primary: {main: "#1976d2"}  ,
    secondary: {main: "#dc004e"}
  },
  typography:{
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  }
});

const AppRoutes = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const { token } = auth;
  console.log("Current token:", token);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/dashboard" /> : <Signup />}
      />

      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
    </>
  );
}

export default App;
