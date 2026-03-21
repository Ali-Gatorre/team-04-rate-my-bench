import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMessages,
  fetchUserProfile,
  sendMessage,
  fetchCurrentUser,
} from "../services/api";

export default function ConversationPage() {
  const { userId } = useParams();

  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadConversation();
  }, [userId]);

  async function loadConversation() {
    try {
      const [messagesData, otherUserData, currentUserData] = await Promise.all([
        fetchMessages(userId),
        fetchUserProfile(userId),
        fetchCurrentUser(),
      ]);

      setMessages(messagesData);
      setOtherUser(otherUserData);
      setCurrentUser(currentUserData);
    } catch (err) {
      setError("Unable to load conversation");
    }
  }

  async function handleSend(event) {
    event.preventDefault();

    if (!content.trim() || !otherUser) return;

    try {
      const newMessage = await sendMessage(
        otherUser.id,
        otherUser.username,
        content
      );

      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    } catch (err) {
      setError("Unable to send message");
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>
        Conversation with {otherUser ? `@${otherUser.username}` : "user"}
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "16px",
          minHeight: "300px",
          marginBottom: "16px",
        }}
      >
        {messages.length === 0 && <p>No messages yet.</p>}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "12px",
              textAlign:
                currentUser && message.sender_id === currentUser.id
                  ? "right"
                  : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "12px",
                backgroundColor:
                  currentUser && message.sender_id === currentUser.id
                    ? "#2d4b7c"
                    : "#222",
              }}
            >
              <strong>@{message.sender_username}</strong>
              <p style={{ marginTop: "6px" }}>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
