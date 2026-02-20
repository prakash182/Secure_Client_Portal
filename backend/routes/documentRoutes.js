const express = require("express");
const router = express.Router();

// Middlewares
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware").protect;

// Controllers
const {
  uploadDoc,
  addNewVersion
} = require("../controllers/documentController");

// =======================
// Upload New Document
// =======================
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadDoc
);

// =======================
// Upload New Version
// =======================
router.post(
  "/:id/new-version",
  auth,
  upload.single("file"),
  addNewVersion
);

module.exports = router;