
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Task must belong to a user'],
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'review', 'done'], 
        default: 'to-do',
    },
    dueDate: {
        type: Date,
        default: null,
    },
}, { 
    timestamps: true 
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;