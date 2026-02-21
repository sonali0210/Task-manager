import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
} from "../services/taskServices";
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
  List,
  ListItem,
} from "@mui/material";

const Dashboard = () => {
  const { token, logout,setLoading, showSnackbar } = useContext(AuthContext)!;
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");

  //UX states
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Auto-clear notifications
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  });

  // Fetch Tasks
  useEffect(() => {
    if (token) {
      setLoading(true);
      getTasks(token)
        .then((res) => {
          setTasks(res.data);
        })
        .catch(() => {
          showSnackbar("Failed to fetch tasks");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  // Add Task
  const handleAddTask = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }
    try {
      setLoading(true);
      const res = await addTask(title, token);
      setTasks([...tasks, res.data]);
      setTitle("");
      showSnackbar("Task added successfully","success");
    } catch {
      showSnackbar("Failed to add task","error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await deleteTask(id, token!);
      setTasks(tasks.filter((t) => t._id !== id));
      showSnackbar("Task deleted successfully","success");
    } catch (err: any) {
      showSnackbar(err.response?.data?.error || "Failed to delete task","error");
    } finally {
      setLoading(false);
    }
  };

  // Edit Task
  const startEdit = (task: any) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  // Save Edited Task
  const saveEdit = async () => {
    if (!editId) {
      return;
    }
    try {
      setLoading(true);
      const taskToUpdate = tasks.find((t) => t._id === editId);
      const res = await updateTask(
        editId,
        { title: editTitle, status: taskToUpdate?.status },
        token!,
      );
      setTasks(tasks.map((t) => (t._id === editId ? res.data : t)));
      setEditId(null);
      setEditTitle("");
      showSnackbar("Task updated successfully","success");
    } catch {
      showSnackbar("Failed to update task","error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Task Status
  const toggleStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      const newStatus = status === "completed" ? "pending" : "completed";
      const res = await updateTask(id, { status: newStatus }, token!);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      showSnackbar("Task status updated successfully","success");
    } catch (err: any) {
      showSnackbar(err.response?.data?.error || "Failed to update task status","error");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Finlec Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to your Dashboard
        </Typography>

        {/* Add Task */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="New Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            disabled={!title.trim()}
          >
            Add Task
          </Button>
        </Box>

        {/* Filter */}
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 3 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>

        {/* Task List */}
        <List>
          {tasks
            .filter((t) => (filter === "all" ? true : t.status === filter))
            .map((t) => (
              <ListItem key={t._id} sx={{ display: "flex", gap: 2 }}>
                {editId === t._id ? (
                  <>
                    <TextField
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <Select
                      value={t.status}
                      onChange={(e) =>
                        setTasks(
                          tasks.map((task) =>
                            task._id === t._id
                              ? { ...task, status: e.target.value }
                              : task,
                          ),
                        )
                      }
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={saveEdit}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ flexGrow: 1 }}>
                      {t.title} - {t.status}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteTask(t._id)}
                      // disabled={loading}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      color={t.status === "completed" ? "warning" : "success"}
                      onClick={() => toggleStatus(t._id, t.status)}
                      // disabled={loading}
                    >
                      {t.status === "completed"
                        ? "Mark Pending"
                        : "Mark Completed"}
                    </Button>
                  </>
                )}
              </ListItem>
            ))}
        </List>
      </Container>
   
    </>
  );
};

export default Dashboard;
