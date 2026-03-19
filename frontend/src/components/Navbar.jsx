import { Link } from "react-router-dom";

export default function Navbar({ currentUser, notificationsCount, onLogout }) {
  const avatarUrl =
    currentUser?.profile_image_path
      ? `http://localhost:5003${currentUser.profile_image_path}`
      : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #333",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
          RateMyBench
        </Link>

        <Link to="/add-bench">Create Post</Link>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {currentUser ? (
          <>
            <Link to="/messages">💬</Link>

            <Link to="/notifications" style={{ position: "relative" }}>
              🔔
              {notificationsCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-12px",
                    background: "red",
                    color: "white",
                    borderRadius: "999px",
                    fontSize: "12px",
                    padding: "2px 6px",
                  }}
                >
                  {notificationsCount}
                </span>
              )}
            </Link>

            <Link
              to={`/profile/${currentUser.id}`}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser.username}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#333",
                  }}
                />
              )}
              <span>{currentUser.username}</span>
            </Link>

            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
