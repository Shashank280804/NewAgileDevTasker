
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  stage: {
    type: String,
    enum: ['todo', 'in progress', 'completed'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'normal'],
    required: true
  },
  assignedMembers: [{  // Changed to allow multiple team members
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
  }],
  assignedTo: {  // Tracks who assigned the task, referencing User model
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;





// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   stage: {
//     type: String,
//     enum: ['todo', 'in progress', 'completed'],
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   priority: {
//     type: String,
//     enum: ['high', 'medium', 'normal'],
//     required: true
//   },
//   assignedMember: { 
//   type: mongoose.Schema.Types.ObjectId, 
//   ref: "TeamMember" }, 

// });

// const Task = mongoose.model("Task", taskSchema);
// module.exports = Task;

// // export default mongoose.model("Task", taskSchema);