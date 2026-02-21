import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

export const getTasks = (token:string) => {
    return(
        axios.get(API_URL,{
            headers:{Authorization: `Bearer ${token}`},
        })
    )
}

export const addTask = (title: string, token: string) => {
    return axios.post(API_URL, {title}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteTask = (id: string, token: string) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateTask = (
    id: string, 
    data: {title?: string; status?: string}, 
    token: string) => {
    return axios.put(`${API_URL}/${id}`,data, {
        headers: { Authorization: `Bearer ${token}` },
    });
}