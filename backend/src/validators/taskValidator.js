const { body, param } = require("express-validator");

const taskIdValidator = [
    param("id").isMongoId().withMessage("Invalid task ID.")
];

const createTaskValidator = [
    body("title")
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage("Task title must be between 2 and 120 characters."),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters."),
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Status must be todo, in-progress, or done."),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high."),
    body("dueDate")
        .optional({ values: "falsy" })
        .isISO8601()
        .withMessage("Due date must be a valid date.")
];

const updateTaskValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage("Task title must be between 2 and 120 characters."),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters."),
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Invalid task status."),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid task priority."),
    body("dueDate")
        .optional({ values: "falsy" })
        .isISO8601()
        .withMessage("Due date must be a valid date.")
];

const updateStatusValidator = [
    body("status")
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Status must be todo, in-progress, or done.")
];

module.exports = {
    taskIdValidator,
    createTaskValidator,
    updateTaskValidator,
    updateStatusValidator
};
