const db = require("../config/db");

exports.findByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

exports.createUser = (user, callback) => {
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [
    user.name,
    user.email,
    user.password,
    user.role
  ], callback);
};