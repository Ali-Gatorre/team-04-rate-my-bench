export default function NotificationsPage({ notifications }) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 && <p>No notifications yet.</p>}

      {notifications.length > 0 && (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} style={{ marginBottom: "12px" }}>
              <strong>{notification.type}</strong> — {notification.message}
              {!notification.is_read && " (new)"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
