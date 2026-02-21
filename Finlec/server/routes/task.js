const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');    

// Middleware to authenticate user
const auth = (req,res,next) => {
    const header = req.headers.authorization;
    console.log("Authorization header:", header); // Debug log
    if(!header){
        return(
            res.status(401).json({error:"No token provided"})
        );
    }

        const token = header.split(" ")[1];
        console.log("Extracted token:", token);  // Debug log
    
    try{
        const decoded = jwt.verify(token,"secretkey");
        console.log("Decoded token:", decoded); // Debug log
        req.userId = decoded.id;
        next();
    }
    catch(err){
        console.error("Token verification error", err); // Debug log
       return res.status(401).json({error:"Invalid token"});
    }
}

// Add Task
router.post(
    "/",auth,async (req,res) => {
        const task = new Task({...req.body,user:req.userId});
        await task.save();
        res.json(task);
    }
);

// Get Tasks
router.get(
    "/",auth,async (req,res) => {
        const tasks = await Task.find({user:req.userId});
        res.json(tasks);
    }
);

// Update Task
router.put("/:id",auth,async (req,res)=>{
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    );
    res.json(task);
});

// Delete Task
router.delete("/:id",auth,async (req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.json({message:"Task deleted"});
});

module.exports = router;

