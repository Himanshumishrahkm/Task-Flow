const { body } = require("express-validator");

const registerValidator = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 60 })
        .withMessage("Name must be between 2 and 60 characters."),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),
    body("password")
        .isString()
        .isLength({ min: 8, max: 72 })
        .withMessage("Password must be between 8 and 72 characters.")
];

const loginValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .normalizeEmail(),
    body("password")
        .isString()
        .notEmpty()
        .withMessage("Password is required.")
];

module.exports = { registerValidator, loginValidator };
