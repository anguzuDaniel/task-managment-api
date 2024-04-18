const { Task } = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, title, completed, dueDate, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        let query = {};

        // Apply filters
        if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (completed) query.completed = completed === 'true'; // Convert string to boolean
        if (dueDate) query.dueDate = { $gte: new Date(dueDate) }; // Filter tasks with due date greater than or equal to the specified date
        if (tags) query.tags = { $in: tags.split(',') }; // Filter tasks by tags

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            collation: { locale: 'en' },
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        };

        // Fetch paginated and filtered tasks from the database
        const tasks = await Task.paginate(query, options);

        res.json(tasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) return res.status(400).json({ message: 'ID parameter is missing' });

        const task = await Task.findById(id)
        
        if (!task) {
            console.log("Task not found");
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error finding task:', error);
        res.status(500).json({ message: 'Failed to find task' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, tags, dueDate, reminders, notifications } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Invalid request' })           
        }

        const newTask = new Task({ title, description, tags, dueDate, reminders, notifications });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) { 
        console.error('Failed to create task:', error);
        res.status(500).json({ message: 'Failed to create task.' })
    }
}

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) return res.status(400).json({ message: 'ID parameter is missing' });

        const task = await Task.findByIdAndDelete(id)
        
        if (!task) {
            console.log("Task not found");
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Failed to delete task' });
    }
}

const updateTask = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) return res.status(400).json({ message: 'ID parameter is missing' });

        // Extract the updated task data from the request body
        const updatedTaskData = req.body;

        // Ensure that the request body contains data to update
        if (!updatedTaskData) {
            return res.status(400).json({ message: 'No data provided for updating task' });
        }

        // Update the task using findByIdAndUpdate
        const updatedTask = await Task.findByIdAndUpdate(id, updatedTaskData, { new: true });
        
        // Check if the task was found and updated successfully
        if (!updatedTask) {
            console.log("Task not found");
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respond with the updated task
        res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Failed to updating task' });
    }
}

const addCommentToTask = async (req, res) => {
    const { taskId, content, authorId } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.comments.push({ content, author: authorId });
        await task.save();

        return res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment to task:', error);
        return res.status(500).json({ message: 'Failed to add comment to task' });
    }
};

const uploadAttachmentToTask = async (req, res) => {
    const { taskId } = req.params;
    const { attachment } = req.body;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Here, you would handle uploading the attachment and storing its path
        // For simplicity, let's assume the attachment is already uploaded and its path is provided in the request body
        task.attachments.push(attachment);
        await task.save();

        return res.status(200).json({ message: 'Attachment uploaded successfully' });
    } catch (error) {
        console.error('Error uploading attachment to task:', error);
        return res.status(500).json({ message: 'Failed to upload attachment to task' });
    }
};

const searchTasks = async (req, res) => {
    try {
        // Extract search criteria from request query parameters
        const { keywords, tags, startDate, endDate, status } = req.query;

        // Build query object based on search criteria
        const query = {};
        if (keywords) {
            query.$or = [
                { title: { $regex: keywords, $options: 'i' } }, // Case-insensitive search in task title
                { description: { $regex: keywords, $options: 'i' } }
            ];
        }
        if (tags) {
            query.tags = { $in: tags.split(',') }; // Filter tasks by tags
        }
        if (startDate) {
            query.createdAt = { $gte: new Date(startDate) }; // Filter tasks created on or after the start date
        }
        if (endDate) {
            query.createdAt = { ...query.createdAt, $lte: new Date(endDate) }; // Filter tasks created on or before the end date
        }
        if (status) {
            query.completed = status === 'completed'; // Filter tasks by completion status
        }

        // Execute query to find matching tasks
        const tasks = await Task.find(query);

        // Return matched tasks as response
        res.json(tasks);
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ message: 'Failed to search tasks' });
    }
};

const getCompletionRates = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $group: { _id: "$completed", count: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching completion rates:', error);
        res.status(500).json({ message: 'Failed to fetch completion rates' });
    }
};

const getAverageTaskDuration = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $match: { completed: true, completedAt: { $exists: true } } },
            { $project: { duration: { $subtract: ["$completedAt", "$createdAt"] } } },
            { $group: { _id: null, averageDuration: { $avg: "$duration" } } }
        ]);
        res.json({ averageDuration: stats[0].averageDuration });
    } catch (error) {
        console.error('Error calculating average task duration:', error);
        res.status(500).json({ message: 'Failed to calculate average task duration' });
    }
};

const getTaskDistribution = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching task distribution:', error);
        res.status(500).json({ message: 'Failed to fetch task distribution' });
    }
};

module.exports = { getTasks, createTask, deleteTask, updateTask, getTaskById, addCommentToTask, uploadAttachmentToTask, searchTasks, getCompletionRates, getAverageTaskDuration, getTaskDistribution };