const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller"); // Adjust path if necessary
const Task = require("../models/task.model"); // Add if Task is directly referenced here

router.post("/tasks", taskController.createTask);

router.get("/tasks/count", taskController.getTasksCount);
router.get("/tasks/count/completed", taskController.getCompletedTasksCount);
router.get("/tasks/count/in-progress", taskController.getInProgressTasksCount);
router.get("/tasks/count/todo", taskController.getTodoTasksCount);

router.get("/tasks/:id", taskController.getTaskById);
router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/assigned/:memberId", taskController.getTasksAssignedToMember);

router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

router.put("/tasks/:id/assign-members", taskController.assignMultipleMembers);


module.exports = router;
