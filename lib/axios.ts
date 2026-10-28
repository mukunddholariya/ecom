import axios from "axios"

/**
 * Pre-configured Axios instance.
 * baseURL points to the Next.js API routes (/api/*).
 * Swap the baseURL to a real backend URL when leaving prototype mode.
 */
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor — attach auth token when available
apiClient.interceptors.request.use((config) => {
  // TODO (real auth): read token from secure storage and attach as Bearer
  return config
})

// Response interceptor — normalise error shape
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unwrap Axios error into a plain Error for consistent catching
    const message =
      (error?.response?.data as { message?: string })?.message ??
      error?.message ??
      "Something went wrong"
    return Promise.reject(new Error(message))
  }
)

export default apiClient
