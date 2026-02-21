import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/authServices";
import { Link } from "react-router-dom";
import { Box, TextField, Typography, Button ,Container} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {setLoading, showSnackbar } = useContext(AuthContext)!;

  if (!auth) {
    return <p>AuthContext not available</p>;
  }
  const { login } = auth;
  const handleSubmit = async () => {
    try {
      const res = await loginService(email, password);
      login(res.data.token);
      // console.log("Login successful, token:", res.data.token);
      // alert("Login Successful!!");
      showSnackbar("Login Successful!!", "success");
      navigate("/dashboard");
    } catch (err) {
      showSnackbar("Login Failed! Invalid credentials", "error");
    } finally {
      setLoading(false);
    } 
  };

  return (
    <>
      <Container maxWidth="xs">
      <Box sx={{mt: 8, p:3, boxShadow:3, borderRadius: 2}}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Finlec
        </Typography>
        <TextField label="Email" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)}/>
        <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)}/>
        <Button variant="contained" color="primary" fullWidth sx={{mt: 2}} onClick={handleSubmit}>
          Login
        </Button>
        <Typography variant="body2" align="center" sx={{mt: 2}}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Box>
      </Container>
    </>
  );
};

export default Login;
