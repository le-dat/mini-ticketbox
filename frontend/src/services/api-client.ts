import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { setServerClockOffset } from '../utils/time';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Axios Interceptor cập nhật offset từ header Date của server trên mỗi response
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


