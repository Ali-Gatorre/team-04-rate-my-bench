const API1_URL = import.meta.env.VITE_API1_URL || "http://localhost:5001";
const API2_URL = import.meta.env.VITE_API2_URL || "http://localhost:5002";

export async function fetchBenches({ search = "", sort = "latest" } = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const response = await fetch(`${API1_URL}/benches?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch benches");
  }

  return response.json();
}

export async function fetchBenchById(id) {
  const response = await fetch(`${API1_URL}/benches/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch bench");
  }

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

  if (!response.ok) {
    throw new Error("Failed to vote on bench");
  }

  return response.json();
}

export async function fetchCommentsByBenchId(benchId) {
  const response = await fetch(`${API2_URL}/comments?bench_id=${benchId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

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

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}
export async function createBench(formData) {
  const response = await fetch(`${API1_URL}/benches`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create bench");
  }

  return response.json();
}
