const TeamMember = require("../models/teamMember.model");

// Create a new team member
const createTeamMember = async (req, res) => {
  try {
    const { username, title, email, role } = req.body;

    // Check if all required fields are provided
    if (!username || !title || !email || !role) {
      return res.status(400).json({ message: "Username, title, email, and role are required" });
    }

    const newTeamMember = new TeamMember({ username, title, email, role });
    await newTeamMember.save();
    res.status(201).json({ message: "Team member created successfully", teamMember: newTeamMember });
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation error", error: error.errors });
    }
    res.status(500).json({ message: "Error creating team member", error: error.message });
  }
};

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team members", error });
  }
};

// Get a single team member by ID
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team member", error });
  }
};

// Update a team member by ID
const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { username, title, email, role } = req.body;

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      { username, title, email, role },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member updated successfully", teamMember });
  } catch (error) {
    res.status(500).json({ message: "Error updating team member", error });
  }
};

// Delete a team member by ID
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team member", error });
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
};
