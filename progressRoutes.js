import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ================= GET USER PROGRESS ================= */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM progress WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("GET PROGRESS ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(results[0]);
    }
  );
});

/* ================= UPDATE USER PROGRESS ================= */
router.post("/:userId", (req, res) => {
  const { userId } = req.params;
  const {
    level,
    xp,
    next_level_xp,
    streak,
    completed,
    accuracy,
    speed,
    consistency
  } = req.body;

  db.query(
    `UPDATE progress 
     SET level=?, xp=?, next_level_xp=?, streak=?, 
         completed=?, accuracy=?, speed=?, consistency=? 
     WHERE user_id=?`,
    [
      level,
      xp,
      next_level_xp,
      streak,
      completed,
      accuracy,
      speed,
      consistency,
      userId
    ],
    (err) => {
      if (err) {
        console.error("UPDATE PROGRESS ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.json({ message: "Progress updated successfully" });
    }
  );
});

export default router;