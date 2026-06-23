export const USER_SESSION_EXPIRATION_S = 60 * 60 * 24 * 30; // 30 days
export const USER_SESSION_EXPIRATION_MS = 1000 * USER_SESSION_EXPIRATION_S;

export const OpenApiTags = {
  USER: "User",
  AUTH: "Auth",
} as const;
