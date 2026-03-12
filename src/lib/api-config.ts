/**
 * Centralized API URL configuration.
 * All frontend files should import API_URL from here
 * instead of defining it locally.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
