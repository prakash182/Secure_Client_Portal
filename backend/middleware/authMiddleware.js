const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================= AUTHENTICATION =================
exports.protect = (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query(
      "SELECT id, name, email, role, lock_until FROM users WHERE id = ?",
      [decoded.id],
      (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.length === 0) {
          return res.status(401).json({
            message: "User not found",
          });
        }

        const user = result[0];

        // 🔐 Account Lock Check
        if (user.lock_until && new Date(user.lock_until) > new Date()) {
          return res.status(403).json({
            message: "Account temporarily locked",
          });
        }

        req.user = user;
        next();
      }
    );

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ================= ROLE BASED ACCESS =================
exports.authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied for your role",
      });
    }

    next();
  };
};