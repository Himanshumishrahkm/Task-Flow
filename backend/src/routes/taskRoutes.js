const express = require("express");
const {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");
const {
    getTasksByProject,
    createTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
    mongoIdValidator,
    createProjectValidator,
    updateProjectValidator
} = require("../validators/projectValidator");
const { createTaskValidator } = require("../validators/taskValidator");

const router = express.Router();

router.use(protect);

router.route("/")
    .get(getProjects)
    .post(createProjectValidator, validate, createProject);

router.route("/:id")
    .put(mongoIdValidator, updateProjectValidator, validate, updateProject)
    .delete(mongoIdValidator, validate, deleteProject);

router.route("/:id/tasks")
    .get(mongoIdValidator, validate, getTasksByProject)
    .post(mongoIdValidator, createTaskValidator, validate, createTask);

module.exports = router;
