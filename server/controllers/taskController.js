const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User'); 

const getTasks = asyncHandler(async (req, res) => {
    let query = {};

    if (req.user.role === 'Admin') {
        query = {}; 
        console.log(`Admin user ${req.user.id} accessing all tasks.`);
    } else {
        query = { ownerId: req.user.id };
        console.log(`Member user ${req.user.id} accessing owned tasks only.`);
    }

    const tasks = await Task.find(query)
        .populate('ownerId', 'name email') 
        .sort({ createdAt: -1 }); 

    res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, dueDate, recurrence } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Task title is required.');
    }

    const task = await Task.create({
        ownerId: req.user.id, 
        title,
        description,
        status,
        dueDate,
        recurrence
    });

    if (task) {
        res.status(201).json({
            _id: task._id,
            ownerId: task.ownerId,
            title: task.title,
            status: task.status,
            createdAt: task.createdAt,
        });
    } else {
        res.status(400);
        throw new Error('Invalid task data received.');
    }
});


const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (task.ownerId.toString() !== req.user.id) {
        res.status(403); 
        throw new Error('User not authorized to update this task');
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true } 
    );

    res.status(200).json(updatedTask);
});


const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    
    if (task.ownerId.toString() !== req.user.id) {
        res.status(403); 
        throw new Error('User not authorized to delete this task');
    }
    
    await task.deleteOne(); 

    res.status(200).json({ id: req.params.id, message: 'Task removed' });
});


module.exports = {
    getTasks,
    createTask,
    updateTask, 
    deleteTask, 
};