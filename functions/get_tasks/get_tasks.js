const { Task } = require('../../models/Task');

const handler = async (event) => {
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

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }