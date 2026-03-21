import { Link } from "react-router-dom";

export default function BenchCard({ bench, onVote }) {
  const imageUrl = bench.image_path
    ? `http://localhost:5001${bench.image_path}`
    : null;

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#111",
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={bench.title}
          style={{
            width: "100%",
            maxHeight: "420px",
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "12px",
            backgroundColor: "#111",
          }}
        />
      )}

      <h3>{bench.title}</h3>
      <p>{bench.caption}</p>

      <p>
        <strong>Location:</strong> {bench.location_name || "Unknown"}
      </p>

      <p>
        <strong>Author:</strong>{" "}
        <Link to={`/profile/username/${encodeURIComponent(bench.author_name)}`}>
          @{bench.author_name}
        </Link>
      </p>

      <p>
        <strong>Score:</strong> {bench.score} | 👍 {bench.upvotes} | 👎 {bench.downvotes}
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {onVote && (
          <>
            <button onClick={() => onVote(bench.id, 1)}>Upvote</button>
            <button onClick={() => onVote(bench.id, -1)}>Downvote</button>
          </>
        )}

        <Link to={`/bench/${bench.id}`}>
          <button>Open Post</button>
        </Link>
      </div>
    </div>
  );
}
