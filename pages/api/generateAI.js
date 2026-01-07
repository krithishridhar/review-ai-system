import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { rating, review } = req.body;

    if (!review || !rating) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const prompt = `
User review: "${review}"
Rating: ${rating} stars

1. Give short reply to user
2. Give brief summary
3. Recommend business action

Return ONLY JSON like:
{
 "aiResponse": "...",
 "aiSummary": "...",
 "aiAction": "..."
}
`;

    const r = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const text =
      r.data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI returned nothing";

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = {
        aiResponse: text,
        aiSummary: "Could not parse summary",
        aiAction: "No action generated"
      };
    }

    return res.status(200).json(json);
  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    return res.status(500).json({ error: "Server failed" });
  }
}
