// routes/teamMember.route.js

const express = require("express");
const router = express.Router();
const { 
  createTeamMember, 
  getAllTeamMembers, 
  getTeamMemberById, 
  updateTeamMember, 
  deleteTeamMember 
} = require("../controllers/team-member-controller"); // Import controller

// Route to get all team members
router.get("/team-members", getAllTeamMembers);

// Route to create a new team member
router.post("/team-members", createTeamMember);

// Route to get a team member by ID
router.get("/team-members/:id", getTeamMemberById);

// Route to update a team member by ID
router.put("/team-members/:id", updateTeamMember);

// Route to delete a team member by ID
router.delete("/team-members/:id", deleteTeamMember);

module.exports = router;
