const { body, param } = require("express-validator");

const mongoIdValidator = [
    param("id").isMongoId().withMessage("Invalid project ID.")
];

const createProjectValidator = [
    body("title")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Project title must be between 2 and 100 characters."),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters.")
];

const updateProjectValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Project title must be between 2 and 100 characters."),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters.")
];

module.exports = {
    mongoIdValidator,
    createProjectValidator,
    updateProjectValidator
};
