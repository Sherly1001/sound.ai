import axios from 'axios';
import { API_URL } from '../utils/const';

export const axiosInstance = axios.create({
  baseURL: API_URL,
});
