import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rating, review, aiResponse, aiSummary, aiAction } = req.body;

  try {
    await addDoc(collection(db, "reviews"), {
      rating,
      review,
      aiResponse,
      aiSummary,
      aiAction,
      createdAt: serverTimestamp()
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
