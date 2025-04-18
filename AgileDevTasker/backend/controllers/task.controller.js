const Task = require("../models/task.model");
const mongoose = require("mongoose");


const createTask = async (req, res) => {
  try {
    const { title, stage, date, priority, assignedTo } = req.body;

    if (!title || !stage || !date || !priority) {
      return res
        .status(400)
        .json({ error: "Title, stage, date, and priority are required" });
    }

    // Validate assignedTo
    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({ error: "Invalid assignedTo ID" });
    }
    const task = new Task({ title, stage, date, priority, assignedTo });
    await task.save();

    console.log("Task added"); // Log message for successful task addition
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTaskById = async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "stage", "date", "priority"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: "Bad Request" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTasksCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({});
    res.json({ count });
  } catch (error) {
    console.error("Error fetching tasks count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCompletedTasksCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ stage: "completed" });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching completed tasks count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getInProgressTasksCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ stage: "in progress" });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching in progress tasks count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTodoTasksCount = async (req, res) => {
  try {
    const count = await Task.countDocuments({ stage: "todo" });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching todo tasks count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTasksAssignedToMember = async (req, res) => {
  const memberId = req.params.memberId;
  console.log("Fetching tasks for member with ID:", memberId);

  try {
    const tasks = await Task.find({ assignedMembers: memberId });  // Query tasks by memberId
    res.status(200).json(tasks);  // Just return the tasks array
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};



const assignMultipleMembers = async (req, res) => {
  const { id } = req.params;
  const { memberIds, assignedToId } = req.body; // Get member IDs and assignedTo user ID

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignedMembers = memberIds; // Assign multiple team members
    task.assignedTo = assignedToId; // Track who assigned the members
    await task.save();

    res.json({ message: 'Members assigned successfully', task });
  } catch (error) {
    console.error("Error assigning members:", error);
    res.status(500).json({ message: 'Error assigning members', error });
  }
};





module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
  getTasksCount,
  getCompletedTasksCount,
  getInProgressTasksCount,
  getTodoTasksCount,
  assignMultipleMembers,
  getTasksAssignedToMember,

};
