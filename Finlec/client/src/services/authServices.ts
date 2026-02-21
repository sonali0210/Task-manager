import axios from "axios";

const API_URL = "http://localhost:5000/auth";


// Signup
export const signup = (username:string,email: string, password: string) => {
    return axios.post(`${API_URL}/signup`, { username, email, password });
}


// Login
export const login = (email:string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
}

// Logout
export const logout = () => {
    localStorage.removeItem("token");
}