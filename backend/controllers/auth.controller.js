const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= REGISTER =================
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Check if user exists
  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json(err);

      const newUser = {
        name,
        email,
        password: hash,
        role: role || "client",
      };

      // Insert user
      User.createUser(newUser, (err, data) => {
        if (err) return res.status(500).json(err);

        const token = generateToken(data.insertId, newUser.role);

        res.status(201).json({
          message: "Registered successfully",
          token,
          user: {
            id: data.insertId,
            name,
            email,
            role: newUser.role,
          },
        });
      });
    });
  });
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  User.findByEmail(email, async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    // Check if account is locked
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      return res.status(403).json({
        message: "Account locked. Try later.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    // ❌ Wrong password
    if (!match) {

      // Increase failed attempts
      db.query(
        "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = ?",
        [user.id]
      );

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Reset failed attempts on success
    db.query(
      "UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?",
      [user.id]
    );

    // ✅ INSERT LOGIN LOG
    db.query(
      "INSERT INTO audit_logs (user_id, action, ip) VALUES (?, ?, ?)",
      [user.id, "LOGIN_SUCCESS", req.ip]
    );

    const token = generateToken(user.id, user.role);

    res.json({
      message: "Login success",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};
exports.getMyProfile = (req, res) => {

  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });

};
exports.createAdmin = (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  bcrypt.hash(password, 10, (err, hash) => {

    if (err) return res.status(500).json(err);

    const sql = `
      INSERT INTO users (name,email,password,role)
      VALUES (?,?,?,'admin')
    `;

    db.query(sql, [name, email, hash], (err, result) => {

      if (err) return res.status(500).json(err);

      res.json({
        message: "Admin created successfully",
      });

    });
  });
};