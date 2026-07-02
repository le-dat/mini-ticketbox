const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${host}:3000`;

export const WS_STALE_THRESHOLD_MS = 10_000; // Consider stale after 10s disconnect
export const STALE_POLL_INTERVAL_MS = 5_000; // Fallback poll every 5s when WS connection is dead
