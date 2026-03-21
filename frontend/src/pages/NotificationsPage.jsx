import { useState } from "react";
import { markNotificationAsRead } from "../services/api";

export default function NotificationsPage({ notifications }) {
  const [localNotifications, setLocalNotifications] = useState(notifications || []);
  const [error, setError] = useState("");

  async function handleMarkAsRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId);

      setLocalNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      setError("Unable to update notification");
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Notifications</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {localNotifications.length === 0 && <p>No notifications yet.</p>}

      {localNotifications.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {localNotifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #333",
                borderRadius: "10px",
                backgroundColor: notification.is_read ? "#111" : "#1a1a2e",
              }}
            >
              <p style={{ marginBottom: "6px" }}>
                <strong>{notification.type}</strong> — {notification.message}
              </p>

              <small style={{ display: "block", marginBottom: "8px" }}>
                {new Date(notification.created_at).toLocaleString()}
              </small>

              {!notification.is_read && (
                <button onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
