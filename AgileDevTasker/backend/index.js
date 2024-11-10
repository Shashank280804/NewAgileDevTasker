const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const userRouter = require("./routers/user.route");
const taskRouter = require("./routers/task.route");
const teamMemberRouter = require("./routers/teamMember.route");

// MongoDB Atlas connection URI from environment variable
const uri = process.env.MONGO_URI;

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Connection event handlers
db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// CORS middleware configuration to allow requests from any origin
app.use(cors({
  origin: true, // Allow any origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(teamMemberRouter);

// Start Express server
app.listen(port, () => {
  console.log("Server is up on the port: " + port);
});
