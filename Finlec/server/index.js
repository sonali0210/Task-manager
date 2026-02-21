const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');


app.use(express.json());
app.use(cors());
app.use('/auth',authRoutes);
app.use('/tasks',taskRoutes);

mongoose.connect('mongodb://localhost:27017/taskmanager')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error("MongoDB connection error",err));

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
})