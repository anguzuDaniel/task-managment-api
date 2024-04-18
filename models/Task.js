const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
    dueDate: { type: Date },
    reminders: [{ type: Date }],
    notifications: [{ type: Date }],
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who posted the comment
            content: { type: String },
            createdAt: { type: Date, default: Date.now },
        }
    ],
    attachments: [{ type: String }]
});

// Apply pagination plugin to the schema
taskSchema.plugin(mongoosePaginate);

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };