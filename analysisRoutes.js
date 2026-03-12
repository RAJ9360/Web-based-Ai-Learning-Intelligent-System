import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/", async (req, res) => {
  try {
    const { score, total, topic, level, timeTaken } = req.body;

    const percentage = Math.round((score / total) * 100);

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an AI performance analyst for a learning platform.

Return ONLY valid JSON in this format:

{
  "accuracy": number,
  "speed": number,
  "consistency": number,
  "level": "Beginner/Intermediate/Advanced",
  "strengths": ["item1","item2"],
  "weaknesses": ["item1","item2"],
  "suggestions": ["item1","item2","item3"]
}

No extra text.
`
        },
        {
          role: "user",
          content: `
Score: ${score}/${total}
Percentage: ${percentage}%
Topic: ${topic}
Level: ${level}
Time Taken: ${timeTaken} seconds
`
        }
      ],
      temperature: 0.4
    });

    let content = response.choices[0].message.content.trim();

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    const jsonString = content.substring(start, end + 1);
    const parsed = JSON.parse(jsonString);

    res.json(parsed);

  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;