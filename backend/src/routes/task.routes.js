const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Barcha task routelari himoyalangan
router.use(authMiddleware);

// GET /api/tasks
router.get("/", getTasks);

// GET /api/tasks/:id
router.get("/:id", getTaskById);

// POST /api/tasks
router.post("/", createTask);

// PUT /api/tasks/:id
router.put("/:id", updateTask);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

// PATCH /api/tasks/:id/status
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
