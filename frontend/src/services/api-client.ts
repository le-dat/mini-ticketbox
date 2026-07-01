import axios from 'axios';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_BASE_URL = `http://${host}:3000`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
