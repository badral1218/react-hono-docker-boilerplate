import apiClient from "@react-template/api/rpc";

// "/" is proxied to the backend by vite in dev, and served by the backend in prod.
export default apiClient("/").api;
