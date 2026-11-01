const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// one helper for every request: adds the login token automatically
export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("fleet-token");
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
