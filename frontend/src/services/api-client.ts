import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { setServerClockOffset } from '../utils/time';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Axios Interceptor updating clock offset from server Date header on each response
apiClient.interceptors.response.use(
  (response) => {
    const serverDateHeader = response.headers['date'];
    if (serverDateHeader) {
      setServerClockOffset(serverDateHeader);
    }
    return response;
  },
  (error) => {
    const serverDateHeader = error.response?.headers?.['date'];
    if (serverDateHeader) {
      setServerClockOffset(serverDateHeader);
    }
    return Promise.reject(error);
  }
);


