import axios from "axios";

const isDev = import.meta.env.DEV;

// Resolve the API base URL. In development we fall back to the local Laravel
// server. In production we NEVER fall back to localhost: a deployed bundle that
// calls localhost would resolve to the visitor's own device and fail with a
// "Network Error". Instead the URL must be provided via VITE_API_URL.
let resolvedBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
if (!resolvedBaseUrl) {
  if (isDev) {
    resolvedBaseUrl = "http://localhost:8000/api";
  } else {
    resolvedBaseUrl = "";
  }
}

const api = axios.create({
  baseURL: resolvedBaseUrl,
  timeout: 60000, // 60s to accommodate cold starts on free hosting tiers
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campusfind_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Guard against a misconfigured production build: if the API URL is missing
  // or still points at localhost, fail fast with an actionable message instead
  // of letting the request hit the visitor's own machine.
  if (!isDev) {
    const base = (config.baseURL ?? api.defaults.baseURL ?? "") as string;
    if (!base || /localhost|127\.0\.0\.1/.test(base)) {
      return Promise.reject(
        new Error(
          "The API is not configured for this deployment. Set VITE_API_URL to your deployed backend URL (e.g. https://your-api.example.com/api) in your hosting provider and redeploy.",
        ),
      );
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes("/login")) {
      localStorage.removeItem("campusfind_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
