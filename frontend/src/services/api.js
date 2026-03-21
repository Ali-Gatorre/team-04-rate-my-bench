const API1_URL = import.meta.env.VITE_API1_URL || "http://localhost:5001";
const API2_URL = import.meta.env.VITE_API2_URL || "http://localhost:5002";
const API3_URL = import.meta.env.VITE_API3_URL || "http://localhost:5003";
const API4_URL = import.meta.env.VITE_API4_URL || "http://localhost:5004";

export function getAuthToken() {
  return localStorage.getItem("token");
}

export function setAuthToken(token) {
  localStorage.setItem("token", token);
}

export function removeAuthToken() {
  localStorage.removeItem("token");
}

export async function registerUser(userData) {
  const response = await fetch(`${API3_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to register");
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API3_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to login");
  }

  return data;
}

export async function fetchCurrentUser() {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch current user");
  }

  return data;
}

export async function fetchNotifications() {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/users/me/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch notifications");
  }

  return data;
}

export async function fetchBenches({ search = "", sort = "latest" } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const response = await fetch(`${API1_URL}/benches?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch benches");
  return response.json();
}

export async function fetchBenchById(id) {
  const response = await fetch(`${API1_URL}/benches/${id}`);
  if (!response.ok) throw new Error("Failed to fetch bench");
  return response.json();
}

export async function voteBench(benchId, voteData) {
  const response = await fetch(`${API1_URL}/benches/${benchId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voteData),
  });

  if (!response.ok) throw new Error("Failed to vote on bench");
  return response.json();
}

export async function createBench(formData) {
  const response = await fetch(`${API1_URL}/benches`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to create bench");
  return response.json();
}

export async function deleteBench(benchId, authorName) {
  const response = await fetch(`${API1_URL}/benches/${benchId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author_name: authorName,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete bench");
  }

  return data;
}

export async function fetchCommentsByBenchId(benchId) {
  const response = await fetch(`${API2_URL}/comments?bench_id=${benchId}`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

export async function createComment(commentData) {
  const response = await fetch(`${API2_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
}

export async function fetchUserProfile(userId) {
  const response = await fetch(`${API3_URL}/users/${userId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user profile");
  }

  return data;
}

export async function fetchBenchesByAuthor(username) {
  const response = await fetch(`${API1_URL}/benches?author=${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user posts");
  }

  return response.json();
}

export async function uploadAvatar(formData) {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to upload avatar");
  }

  return data;
}

export async function fetchUserByUsername(username) {
  const response = await fetch(`${API3_URL}/users/by-username/${encodeURIComponent(username)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user by username");
  }

  return data;
}

export async function fetchFollowStatus(userId) {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/users/${userId}/follow-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch follow status");
  }

  return data;
}

export async function followUser(userId) {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to follow user");
  }

  return data;
}

export async function unfollowUser(userId) {
  const token = getAuthToken();

  const response = await fetch(`${API3_URL}/users/${userId}/follow`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to unfollow user");
  }

  return data;
}

export async function markNotificationAsRead(notificationId) {
  const token = getAuthToken();

  const response = await fetch(
    `${API3_URL}/users/me/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to mark notification as read");
  }

  return data;
}


export async function fetchConversations() {
  const token = getAuthToken();

  const response = await fetch(`${API4_URL}/messages/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch conversations");
  }

  return data;
}

export async function fetchMessages(userId) {
  const token = getAuthToken();

  const response = await fetch(`${API4_URL}/messages/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch messages");
  }

  return data;
}

export async function sendMessage(userId, receiverUsername, content) {
  const token = getAuthToken();

  const response = await fetch(`${API4_URL}/messages/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receiver_username: receiverUsername,
      content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send message");
  }

  return data;
}
