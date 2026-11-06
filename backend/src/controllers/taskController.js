const Project = require("../models/Project");
const Task = require("../models/Task");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getTasksByProject = async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user._id
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found."
        });
    }

    const filter = {
        project: project._id,
        owner: req.user._id
    };

    if (req.query.status) {
        if (!["todo", "in-progress", "done"].includes(req.query.status)) {
            return res.status(400).json({ success: false, message: "Invalid status filter." });
        }
        filter.status = req.query.status;
    }

    if (req.query.priority) {
        if (!["low", "medium", "high"].includes(req.query.priority)) {
            return res.status(400).json({ success: false, message: "Invalid priority filter." });
        }
        filter.priority = req.query.priority;
    }

    if (req.query.search) {
        filter.title = { $regex: escapeRegex(req.query.search), $options: "i" };
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Task.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        count: tasks.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        tasks
    });
};

const createTask = async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user._id
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found."
        });
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description || "",
        status: req.body.status || "todo",
        priority: req.body.priority || "medium",
        dueDate: req.body.dueDate || null,
        project: project._id,
        owner: req.user._id
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully.",
        task
    });
};

const updateTask = async (req, res) => {
    const allowedFields = ["title", "description", "status", "priority", "dueDate"];
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = field === "dueDate" && req.body[field] === "" ? null : req.body[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide at least one task field to update."
        });
    }

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        task
    });
};

const updateTaskStatus = async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { status: req.body.status },
        { new: true, runValidators: true }
    );

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Task status updated successfully.",
        task
    });
};

const deleteTask = async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Task deleted successfully."
    });
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
};
