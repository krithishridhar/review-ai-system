import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { rating, review } = req.body;

    if (!review) {
      return res.status(400).json({ error: "Empty review" });
    }

    const prompt = `
User review: "${review}"
Rating: ${rating}

1. Write a short reply to user
2. Give brief summary
3. Suggest one recommended action

Return ONLY JSON:
{"aiResponse":"...","aiSummary":"...","aiAction":"..."}
`;

    const r = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text =
      r?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No text from AI";

    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      json = {
        aiResponse: text,
        aiSummary: "Summary unavailable",
        aiAction: "No action generated"
      };
    }

    return res.status(200).json(json);
  } catch (err) {
    // ⛔️ IMPORTANT: send real error back to user
    console.error("BACKEND ERROR:", err?.response?.data || err.message);

    return res.status(500).json({
      error: "Backend failed",
      details: err?.response?.data || err.message
    });
  }
}
