const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
    const owner = req.user._id;
    const now = new Date();

    const [
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks
    ] = await Promise.all([
        Project.countDocuments({ owner }),
        Task.countDocuments({ owner }),
        Task.countDocuments({ owner, status: "todo" }),
        Task.countDocuments({ owner, status: "in-progress" }),
        Task.countDocuments({ owner, status: "done" }),
        Task.countDocuments({
            owner,
            status: { $ne: "done" },
            dueDate: { $ne: null, $lt: now }
        })
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalProjects,
            totalTasks,
            tasksByStatus: {
                todo: todoTasks,
                inProgress: inProgressTasks,
                done: doneTasks
            },
            overdueTasks
        }
    });
};

module.exports = { getDashboardStats };
