const Project = require("../models/Project");

// ================= CREATE PROJECT =================
exports.createProject = async (req, res) => {
  try {
    const { title, description, clientId } = req.body;

    if (!title || !description || !clientId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const project = await Project.create({
      title,
      description,
      clientId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET PROJECTS =================
exports.getProjects = async (req, res) => {
  try {
    let projects;

    // Admin & Employee → see all projects
    if (req.user.role === "admin" || req.user.role === "employee") {
      projects = await Project.find()
        .populate("clientId", "name email")
        .populate("createdBy", "name");
    }

    // Client → only their projects
    if (req.user.role === "client") {
      projects = await Project.find({ clientId: req.user._id })
        .populate("createdBy", "name");
    }

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= GET SINGLE PROJECT =================
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("clientId", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Client ownership check
    if (
      req.user.role === "client" &&
      project.clientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(project);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= DELETE PROJECT (Admin Only) =================
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};