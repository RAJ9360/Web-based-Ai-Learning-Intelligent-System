import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("SELECT ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Insert new user
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err, result) => {
          if (err) {
            console.error("INSERT USER ERROR:", err);
            return res.status(500).json({ message: "Server error" });
          }

          const userId = result.insertId;

          // Create default progress
          db.query(
            "INSERT INTO progress (user_id) VALUES (?)",
            [userId],
            (err) => {
              if (err) {
                console.error("INSERT PROGRESS ERROR:", err);
                return res.status(500).json({ message: "Server error" });
              }

              res.status(201).json({
                message: "User registered successfully",
              });
            }
          );
        }
      );
    }
  );
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0 || results[0].password !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      res.json({
        message: "Login successful",
        userId: results[0].id,
      });
    }
  );
});

export default router;