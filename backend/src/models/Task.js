const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
        minlength: 2,
        maxlength: 120
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: ""
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date,
        default: null
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });

taskSchema.index({ owner: 1, project: 1 });
taskSchema.index({ owner: 1, status: 1, priority: 1 });

module.exports = mongoose.model("Task", taskSchema);
