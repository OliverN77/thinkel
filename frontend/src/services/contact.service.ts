import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormData) => {
  const response = await axios.post(`${API_URL}/contact`, data);
  return response.data;
};