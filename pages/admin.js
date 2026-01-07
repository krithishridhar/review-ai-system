import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Admin() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>

      <table border="1" cellPadding="6" width="100%">
        <thead>
          <tr>
            <th>Rating</th>
            <th>Review</th>
            <th>AI Summary</th>
            <th>AI Action</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map(r => (
            <tr key={r.id}>
              <td>{r.rating}</td>
              <td>{r.review}</td>
              <td>{r.aiSummary}</td>
              <td>{r.aiAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
