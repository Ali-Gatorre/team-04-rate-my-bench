import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBench } from "../services/api";

export default function AddBenchPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0];
    handleFile(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !caption.trim() || !authorName.trim()) {
      setError("Title, caption and author name are required.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("location_name", locationName);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("author_name", authorName);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const newBench = await createBench(formData);

      navigate(`/bench/${newBench.id}`);
    } catch (err) {
      setError("Unable to create bench.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Create a New Bench Post</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Caption / legend"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Location name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            style={{ width: "100%" }}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Author name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px dashed #4da6ff" : "2px dashed #666",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "12px",
            backgroundColor: dragActive ? "#1a1a2e" : "#111",
          }}
        >
          <p>Drag & drop an image here, or choose a file</p>

          <input type="file" accept="image/*" onChange={handleInputChange} />

          {previewUrl && (
            <div style={{ marginTop: "16px" }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Create Bench Post"}
        </button>
      </form>
    </div>
  );
}
