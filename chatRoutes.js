import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required."
      });
    }

    /* ===== Safety check to block direct answer requests ===== */
    const blockedWords = [
      "correct answer",
      "give answer",
      "which option",
      "final answer",
      "solution",
      "tell the answer"
    ];

    const lowerMsg = message.toLowerCase();

    if (blockedWords.some(word => lowerMsg.includes(word))) {
      return res.json({
        reply: `❌ I cannot reveal the direct answer.

💡 Hint

Step 1:
Focus on understanding the logic used in the problem.

Step 2:
Break the problem into smaller steps and analyze the code carefully.

📘 Explanation

Step 1:
Programming questions usually require understanding how the code executes line by line.

Step 2:
Try tracing the program manually to determine what happens at each step.`
      });
    }

    /* ===== Call LLM ===== */
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `
You are an AI Learning Assistant for a quiz platform.

Your job is to guide students WITHOUT giving the final answer.

STRICT RULES:

1. NEVER reveal the final answer.
2. NEVER reveal the correct option (A/B/C/D).
3. NEVER print the final output of the program.
4. NEVER give full code solutions.
5. Only guide the student.

RESPONSE FORMAT (VERY IMPORTANT):

Always write each step on a new line.

Example format:

💡 Hint

Step 1:
Explain the first observation.

Step 2:
Explain the next logical idea.

Step 3:
Explain what the student should analyze next.

Step 4:
Encourage thinking without revealing the answer.

📘 Explanation

Step 1:
Explain the main concept involved.

Step 2:
Explain how the program logic works step-by-step.

Step 3:
Explain what happens during execution.

IMPORTANT:
Each "Step" must be on a new line.
Never combine steps in a paragraph.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    /* ===== Format reply to enforce line breaks ===== */
    let reply = response.choices[0].message.content;

    reply = reply
      .replace(/Step\s*1:/gi, "\nStep 1:")
      .replace(/Step\s*2:/gi, "\nStep 2:")
      .replace(/Step\s*3:/gi, "\nStep 3:")
      .replace(/Step\s*4:/gi, "\nStep 4:");

    res.json({ reply });

  } catch (error) {
    console.error("Chat API Error:", error);

    res.status(500).json({
      reply: "⚠ AI assistant is temporarily unavailable. Please try again later."
    });
  }
});

export default router;