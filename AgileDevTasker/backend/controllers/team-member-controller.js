const TeamMember = require("../models/teamMember.model");

// Create a new team member
const createTeamMember = async (req, res) => {
  try {
    // Log the request body to verify the data sent from the frontend
    console.log("Request Body (createTeamMember):", req.body);

    const { username, title, email, role } = req.body;

    // Check if all required fields are provided
    if (!username || !title || !email || !role) {
      console.log("Missing required fields in createTeamMember");
      return res.status(400).json({ message: "Username, title, email, and role are required" });
    }

    const newTeamMember = new TeamMember({ username, title, email, role });
    await newTeamMember.save();
    console.log("Team member created:", newTeamMember);
    res.status(201).json({ message: "Team member created successfully", teamMember: newTeamMember });
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation error:", error.errors);
      return res.status(400).json({ message: "Validation error", error: error.errors });
    }
    res.status(500).json({ message: "Error creating team member", error: error.message });
  }
};

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    console.log("Fetching all team members...");

    const teamMembers = await TeamMember.find();
    console.log("Fetched team members:", teamMembers);  // Log the fetched data

    if (teamMembers.length === 0) {
      console.log("No team members found.");
      return res.status(404).json({ message: "No team members found" });
    }

    res.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Error fetching team members", error });
  }
};

// Get a single team member by ID
const getTeamMemberById = async (req, res) => {
  try {
    console.log("Fetching team member with ID:", req.params.id);

    const teamMember = await TeamMember.findById(req.params.id);
    console.log("Fetched team member:", teamMember);  // Log the fetched team member

    if (!teamMember) {
      console.log("Team member not found.");
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member by ID:", error);
    res.status(500).json({ message: "Error fetching team member", error });
  }
};

// Update a team member by ID
const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { username, title, email, role } = req.body;

  try {
    console.log("Updating team member with ID:", id);
    console.log("Request Body (update):", req.body);  // Log the request body for update

    const teamMember = await TeamMember.findByIdAndUpdate(
      id,
      { username, title, email, role },
      { new: true }
    );

    if (!teamMember) {
      console.log("Team member not found for update.");
      return res.status(404).json({ message: "Team member not found" });
    }

    console.log("Updated team member:", teamMember);
    res.json({ message: "Team member updated successfully", teamMember });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Error updating team member", error });
  }
};

// Delete a team member by ID
const deleteTeamMember = async (req, res) => {
  try {
    console.log("Deleting team member with ID:", req.params.id);

    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      console.log("Team member not found for deletion.");
      return res.status(404).json({ message: "Team member not found" });
    }

    console.log("Deleted team member:", teamMember);
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
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
