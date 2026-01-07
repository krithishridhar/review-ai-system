import axios from "axios";

export default async function handler(req, res) {
  try {
    console.log("API CALLED");

    console.log("Env key present?", !!process.env.GEMINI_API_KEY);

    const { rating, review } = req.body || {};
    console.log("Incoming body:", req.body);

    if (!review) {
      return res.status(400).json({ error: "Review text missing" });
    }

    const prompt = `
User review: "${review}"
Rating: ${rating}

Reply shortly, summarize, recommend action.
Return JSON only with keys aiResponse, aiSummary, aiAction.
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    console.log("Raw AI response:", response.data);

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "NO TEXT RETURNED";

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = {
        aiResponse: text,
        aiSummary: "Parse error",
        aiAction: "Parse error"
      };
    }

    return res.status(200).json(json);
  } catch (err) {
    console.error("SERVER ERROR FULL OBJECT:", err);
    console.error("SERVER ERROR RESPONSE:", err?.response?.data);

    return res.status(500).json({
      message: "SERVER FAILED",
      hint: "Check message below",
      error: err?.message,
      response: err?.response?.data,
    });
  }
}
