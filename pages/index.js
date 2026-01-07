import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (!review.trim()) {
      alert("Review cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const ai = await axios.post("/api/generateAI", { rating, review });

      const { aiResponse, aiSummary, aiAction } = ai.data;

      await axios.post("/api/saveReview", {
        rating,
        review,
        aiResponse,
        aiSummary,
        aiAction
      });

      setAiResponse(aiResponse);
      setReview("");
    } catch (e) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>User Dashboard</h1>

      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
        style={{ width: "100%", height: 120, display: "block", marginTop: 10 }}
      />

      <button onClick={submitReview} disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {aiResponse && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <b>AI Response:</b>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
