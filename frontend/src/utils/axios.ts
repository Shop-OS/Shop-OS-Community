import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import logout from './logout';

// Create an axios instance
const AxiosProvider = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_COMFY_API_URL}`, // replace with your API base URL
});

// Add a request interceptor
AxiosProvider.interceptors.request.use(
  (config) => {
    const token = Cookies.get('hom_token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AxiosProvider.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      logout();
      window.location.href = '/login';
    }
    if (error.response.status === 403) {
      Cookies.set('hom_isEmailNotVerified', 'true');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default AxiosProvider;
