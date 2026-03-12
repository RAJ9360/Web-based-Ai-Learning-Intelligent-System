import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateQuizFromAI = async (level, topic, type) => {
  try {
    const quizType = type?.toLowerCase() || "theory";

    let typeInstruction = "";

    // ================= CODING MODE =================
    if (quizType === "coding") {
      typeInstruction = `
Generate ONLY coding-based MCQs.

Each question MUST include a multi-line ${topic} code snippet.

Formatting rules:
- Use \\n for line breaks inside the question
- Minimum 5 lines of code
- Include loop OR condition OR method OR array OR OOP

Question types:
- Output prediction
- Error detection
- Bug identification
- Time complexity

DO NOT generate theory questions.
`;
    } 
    // ================= THEORY MODE =================
    else {
      typeInstruction = `
Generate ONLY theory-based conceptual MCQs.

Rules:
- No code snippets
- Focus on concepts, definitions, and behavior
- Avoid output-based questions
`;
    }

    // ================= PROMPT =================
    const prompt = `
You are a senior technical interviewer.

Generate EXACTLY 5 ${level} level ${quizType} MCQs about ${topic}.

Return ONLY valid JSON.

FORMAT:

[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "must match one of the options exactly"
  }
]

STRICT RULES:
- Exactly 5 questions
- Exactly 4 options per question
- correctAnswer must exactly match one option
- No explanations
- No markdown
- Return ONLY JSON

${typeInstruction}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON. Do not include any text outside JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    let content = response.choices?.[0]?.message?.content || "";
    content = content.trim();

    // Remove markdown blocks if present
    content = content.replace(/```json/gi, "").replace(/```/g, "");

    // Extract JSON safely
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");

    if (start === -1 || end === -1) {
      console.log("❌ AI did not return valid JSON structure");
      return [];
    }

    const jsonString = content.substring(start, end + 1);

    let parsed = [];

    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.log("❌ JSON parsing failed");
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.log("❌ AI response is not an array");
      return [];
    }

    // ================= VALIDATION =================
    const validQuestions = parsed.filter((q) => {
      return (
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "string" &&
        q.options.includes(q.correctAnswer)
      );
    });

    console.log(`✅ Generated ${validQuestions.length} valid questions`);

    return validQuestions;

  } catch (error) {
    console.error("🔥 FULL AI ERROR:");
    console.error(error?.response?.data || error.message || error);

    return [];
  }
};