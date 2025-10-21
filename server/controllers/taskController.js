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

    try {
        const existingTask = await Task.findOne({ 
            title: title.trim(), 
            ownerId: req.user.id 
        });

        if (existingTask) {
            res.status(400);
            throw new Error(`Task with title '${title}' already exists for this user.`);
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
        } 
    } catch (error) {
        if (error.code === 11000) {
            res.status(400); 
            throw new Error(`Task with title '${title}' already exists for this user.`);
        }
        throw error;
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

    if (req.body.title && req.body.title !== task.title) {
        const existingTask = await Task.findOne({ 
            title: req.body.title.trim(), 
            ownerId: req.user.id,
            _id: { $ne: req.params.id } 
        });

        if (existingTask) {
            res.status(400);
            throw new Error(`Task with title '${req.body.title}' already exists for this user.`);
        }
    }
    
    Object.keys(req.body).forEach(key => {
        task[key] = req.body[key];
    });

    const updatedTask = await task.save();

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