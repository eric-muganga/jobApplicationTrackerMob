import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Replace with your actual API URL
// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to attach the token to every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get token from AsyncStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
