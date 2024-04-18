const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { getTasks, createTask, deleteTask, updateTask, getTaskById, addCommentToTask, uploadAttachmentToTask, searchTasks, getCompletionRates, getAverageTaskDuration, getTaskDistribution } = require('../controllers/taskController');

// Route to fetch data
router.get('/', ensureAuthenticated, getTasks);

// searches through the tasks
router.get('/search', ensureAuthenticated, searchTasks)

router.get('/:id', ensureAuthenticated, getTaskById);

router.post('/create', ensureAuthenticated, createTask)

router.delete('/delete/:id', ensureAuthenticated, deleteTask)

router.put('/update/:id', ensureAuthenticated, updateTask)

// Add comment to a task
router.post('/:taskId/comments', ensureAuthenticated, addCommentToTask);

// Upload attachment to a task
router.post('/:taskId/attachments', ensureAuthenticated, uploadAttachmentToTask);

router.get('/analytics/completion-rates', ensureAuthenticated, getCompletionRates);

router.get('/analytics/average-duration', ensureAuthenticated, getAverageTaskDuration);

router.get('/analytics/distribution', ensureAuthenticated, getTaskDistribution);

module.exports = router;