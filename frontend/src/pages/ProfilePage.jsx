import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchUserProfile,
  fetchBenchesByAuthor,
  fetchCurrentUser,
  uploadAvatar,
} from "../services/api";
import BenchCard from "../components/BenchCard";

export default function ProfilePage() {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfilePage();
  }, [id]);

  async function loadProfilePage() {
    try {
      setLoading(true);
      setError("");

      const profileData = await fetchUserProfile(id);
      setProfile(profileData);

      const userPosts = await fetchBenchesByAuthor(profileData.username);
      setPosts(userPosts);

      try {
        const me = await fetchCurrentUser();
        setCurrentUser(me);
      } catch {
        setCurrentUser(null);
      }
    } catch (err) {
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await uploadAvatar(formData);
      window.location.reload();
    } catch (err) {
      setError("Unable to upload avatar");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p style={{ padding: "20px" }}>Profile not found.</p>;
  }

  const avatarUrl = profile.profile_image_path
    ? `http://localhost:5003${profile.profile_image_path}`
    : null;

  const isOwnProfile = currentUser && Number(currentUser.id) === Number(profile.id);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          backgroundColor: "#111",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profile.username}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #333",
              }}
            />
          ) : (
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                backgroundColor: "#333",
              }}
            />
          )}

          <div>
            <h2 style={{ marginBottom: "8px" }}>@{profile.username}</h2>
            <p style={{ marginBottom: "6px" }}>
              {profile.first_name} {profile.last_name}
            </p>
            <p style={{ marginBottom: "10px" }}>
              {profile.bio || "No bio yet."}
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <span><strong>{profile.followers_count}</strong> followers</span>
              <span><strong>{profile.following_count}</strong> following</span>
              <span><strong>{posts.length}</strong> posts</span>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div style={{ marginTop: "18px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Change profile picture
            </label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {uploading && <p style={{ marginTop: "8px" }}>Uploading avatar...</p>}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: "16px" }}>Posts by {profile.username}</h3>

        {posts.length === 0 && <p>No posts yet.</p>}

        {posts.length > 0 && (
          <div>
            {posts.map((bench) => (
              <BenchCard
                key={bench.id}
                bench={bench}
                onVote={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
