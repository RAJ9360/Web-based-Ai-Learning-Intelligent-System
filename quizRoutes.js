import express from "express";
import db from "../config/db.js";
import { generateQuizFromAI } from "../services/aiService.js";

const router = express.Router();


// ==============================
// GET - Fetch quiz from MySQL
// ==============================
router.get("/", (req, res) => {
  const { level, topic, type } = req.query;

  let query = "SELECT * FROM quizzes WHERE 1=1";
  const values = [];

  if (level) {
    query += " AND level = ?";
    values.push(level);
  }

  if (topic) {
    query += " AND topic = ?";
    values.push(topic);
  }

  if (type) {
    query += " AND questionType = ?";
    values.push(type);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});


// ==========================================
// POST - Generate quiz questions using AI
// ==========================================
router.post("/generate", async (req, res) => {
  const { level, topic, type } = req.body;

  if (!level || !topic || !type) {
    return res.status(400).json({
      error: "Level, topic and type are required"
    });
  }

  try {
    let questions = [];
    let attempts = 0;

    // 🔥 Retry AI safely up to 5 times
    while (questions.length < 20 && attempts < 5) {
      attempts++;

      try {
        const aiResponse = await generateQuizFromAI(level, topic, type);

        if (Array.isArray(aiResponse)) {
          aiResponse.forEach((q) => {
            if (
              q &&
              q.question &&
              Array.isArray(q.options) &&
              q.options.length === 4 &&
              q.correctAnswer &&
              q.options.includes(q.correctAnswer)
            ) {
              questions.push(q);
            }
          });
        }

      } catch (aiError) {
        console.log(`AI attempt ${attempts} failed:`, aiError.message);
      }
    }

    // ❌ If still empty
    if (questions.length === 0) {
      return res.status(200).json({
        message: "AI temporarily unavailable. Please try again.",
        quizzes: []
      });
    }

    // Always limit to 20
    const finalQuestions = questions.slice(0, 20);

    // ✅ Save to MySQL
    const sql = `
      INSERT INTO quizzes 
      (level, topic, questionType, question, option1, option2, option3, option4, correctAnswer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    finalQuestions.forEach((quiz) => {
      db.query(sql, [
        level,
        topic,
        type,
        quiz.question,
        quiz.options[0],
        quiz.options[1],
        quiz.options[2],
        quiz.options[3],
        quiz.correctAnswer,
      ]);
    });

    res.json({
      message: "Quiz generated successfully ✅",
      quizzes: finalQuestions
    });

  } catch (error) {
    console.error("Quiz Route Error:", error.message);
    res.status(500).json({
      error: "Server error while generating quiz"
    });
  }
});

export default router;
