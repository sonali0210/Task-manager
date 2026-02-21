import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authServices";
import { Container, TextField, Box, Typography, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {setLoading,showSnackbar } = useContext(AuthContext)!;

  const handleSubmit = async () => {
    try {
      await signup(username, email, password);
      // alert("Signup Successful!! Please login to continue.");
      showSnackbar("Signup Successful!! Please login to continue.", "success");
      navigate("/login"); // redirect to login
    } catch (err:any) {
      showSnackbar(err.response?.data?.error || "Signup Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create an Account
          </Typography>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
