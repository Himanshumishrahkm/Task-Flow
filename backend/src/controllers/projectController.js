const Project = require("../models/Project");
const Task = require("../models/Task");

const getProjects = async (req, res) => {
    const projects = await Project.find({ owner: req.user._id })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: projects.length,
        projects
    });
};

const createProject = async (req, res) => {
    const project = await Project.create({
        title: req.body.title,
        description: req.body.description || "",
        owner: req.user._id
    });

    res.status(201).json({
        success: true,
        message: "Project created successfully.",
        project
    });
};

const updateProject = async (req, res) => {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide a title or description to update."
        });
    }

    const project = await Project.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    );

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Project updated successfully.",
        project
    });
};

const deleteProject = async (req, res) => {
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

    await Task.deleteMany({
        project: project._id,
        owner: req.user._id
    });
    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: "Project and its tasks deleted successfully."
    });
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};
