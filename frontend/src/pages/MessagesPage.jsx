import { useEffect, useState } from "react";
import { fetchConversations } from "../services/api";
import { Link } from "react-router-dom";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await fetchConversations();
        setConversations(data);
      } catch (err) {
        setError("Unable to load conversations");
      }
    }

    loadConversations();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Messages</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {conversations.length === 0 && <p>No conversations yet.</p>}

      {conversations.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conversation) => (
            <li
              key={conversation.other_user_id}
              style={{
                padding: "12px",
                border: "1px solid #333",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            >
              <Link to={`/messages/${conversation.other_user_id}`}>
                <strong>@{conversation.other_username}</strong>
              </Link>
              <p style={{ marginTop: "6px" }}>{conversation.last_message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
