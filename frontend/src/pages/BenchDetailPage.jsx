import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBenchById,
  fetchCommentsByBenchId,
  createComment,
  voteBench,
} from "../services/api";

export default function BenchDetailPage() {
  const { id } = useParams();

  const [bench, setBench] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingBench, setLoadingBench] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");

  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    loadBench();
    loadComments();
  }, [id]);

  async function loadBench() {
    try {
      setLoadingBench(true);
      const data = await fetchBenchById(id);
      setBench(data);
    } catch (err) {
      setError("Unable to load bench");
    } finally {
      setLoadingBench(false);
    }
  }

  async function loadComments() {
    try {
      setLoadingComments(true);
      const data = await fetchCommentsByBenchId(id);
      setComments(data);
    } catch (err) {
      setError("Unable to load comments");
    } finally {
      setLoadingComments(false);
    }
  }

  const topLevelComments = comments.filter(
    (comment) => comment.parent_comment_id === null
  );

  function getReplies(parentId) {
    return comments.filter((comment) => comment.parent_comment_id === parentId);
  }

  async function handleVote(voteType) {
    try {
      await voteBench(id, {
        author_name: "Ali",
        vote_type: voteType,
      });
      loadBench();
    } catch (err) {
      setError("Unable to vote");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!authorName.trim() || !content.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      await createComment({
        bench_id: Number(id),
        author_name: authorName,
        content: content,
        parent_comment_id: null,
      });

      setAuthorName("");
      setContent("");
      loadComments();
    } catch (err) {
      setError("Unable to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplySubmit(event, parentCommentId) {
    event.preventDefault();

    if (!replyAuthorName.trim() || !replyContent.trim()) {
      return;
    }

    try {
      setReplySubmitting(true);

      await createComment({
        bench_id: Number(id),
        author_name: replyAuthorName,
        content: replyContent,
        parent_comment_id: parentCommentId,
      });

      setReplyAuthorName("");
      setReplyContent("");
      setReplyingTo(null);
      loadComments();
    } catch (err) {
      setError("Unable to post reply");
    } finally {
      setReplySubmitting(false);
    }
  }

  const imageUrl =
    bench && bench.image_path ? `http://localhost:5001${bench.image_path}` : null;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {loadingBench && <p>Loading bench...</p>}

      {!loadingBench && bench && (
        <div style={{ marginBottom: "30px" }}>
          <h2>{bench.title}</h2>

          {imageUrl && (
            <div
              style={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto 20px auto",
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={imageUrl}
                alt={bench.title}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  display: "block",
                }}
              />
            </div>
          )}

          <p>{bench.caption}</p>
          <p>
            <strong>Location:</strong> {bench.location_name || "Unknown"}
          </p>
          <p>
            <strong>Author:</strong> {bench.author_name}
          </p>
          <p>
            <strong>Score:</strong> {bench.score} | 👍 {bench.upvotes} | 👎 {bench.downvotes}
          </p>

          <button onClick={() => handleVote(1)}>Upvote</button>
          <button onClick={() => handleVote(-1)} style={{ marginLeft: "10px" }}>
            Downvote
          </button>
        </div>
      )}

      {error && <p>{error}</p>}

      <h3>Comments</h3>

      {loadingComments && <p>Loading comments...</p>}

      {!loadingComments && topLevelComments.length === 0 && (
        <p>No comments yet.</p>
      )}

      {!loadingComments && topLevelComments.length > 0 && (
        <ul>
          {topLevelComments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "20px" }}>
              <p>
                <strong>{comment.author_name}</strong>: {comment.content}
              </p>

              <button onClick={() => setReplyingTo(comment.id)}>Reply</button>

              {getReplies(comment.id).length > 0 && (
                <ul style={{ marginTop: "10px", marginLeft: "20px" }}>
                  {getReplies(comment.id).map((reply) => (
                    <li key={reply.id}>
                      <strong>{reply.author_name}</strong>: {reply.content}
                    </li>
                  ))}
                </ul>
              )}

              {replyingTo === comment.id && (
                <form
                  onSubmit={(event) => handleReplySubmit(event, comment.id)}
                  style={{ marginTop: "10px" }}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={replyAuthorName}
                      onChange={(e) => setReplyAuthorName(e.target.value)}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Write your reply"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                  </div>

                  <button type="submit" disabled={replySubmitting}>
                    {replySubmitting ? "Posting..." : "Post Reply"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyAuthorName("");
                      setReplyContent("");
                    }}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3>Add a Comment</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>

        <div>
          <textarea
            placeholder="Write your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
