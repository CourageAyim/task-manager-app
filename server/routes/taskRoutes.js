const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
    getTasks, 
    createTask,
    updateTask, 
    deleteTask 
} = require('../controllers/taskController'); 

router.use(protect); 

router.route('/')
    .get(getTasks) 
    .post(createTask);

router.route('/:id')
    .put(updateTask)    
    .delete(deleteTask); 

module.exports = router;