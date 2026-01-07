import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rating, review } = req.body;

  const prompt = `
User review: "${review}"
Rating: ${rating} stars

1. Generate a helpful reply to the user
2. Give a short summary of the review
3. Suggest recommended next action

Return JSON:
{
 "aiResponse": "...",
 "aiSummary": "...",
 "aiAction": "..."
}
`;

  try {
    const r = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const text = r.data.candidates[0].content.parts[0].text;
    const json = JSON.parse(text);

    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: "AI error", details: e.message });
  }
}
