const express = require("express");
const {
    updateTask,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
    taskIdValidator,
    updateTaskValidator,
    updateStatusValidator
} = require("../validators/taskValidator");

const router = express.Router();

router.use(protect);

router.put("/:id", taskIdValidator, updateTaskValidator, validate, updateTask);
router.patch("/:id/status", taskIdValidator, updateStatusValidator, validate, updateTaskStatus);
router.delete("/:id", taskIdValidator, validate, deleteTask);

module.exports = router;
