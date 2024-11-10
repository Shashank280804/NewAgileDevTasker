// models/teamMember.js

const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
