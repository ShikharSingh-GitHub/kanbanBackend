const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getTasks).post(verifyToken, createTask);
router.route('/:id').put(verifyToken, updateTask).delete(verifyToken, deleteTask);

module.exports = router;
