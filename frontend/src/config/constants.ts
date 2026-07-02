const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${host}:3000`;

export const WS_STALE_THRESHOLD_MS = 10_000; // Coi là stale sau 10s mất kết nối
export const STALE_POLL_INTERVAL_MS = 5_000; // Fallback poll mỗi 5s khi WS chết hẳn
