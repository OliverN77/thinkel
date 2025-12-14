import axios from 'axios';

const API_URL = 'https://thinkel.onrender.com';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormData) => {
  const response = await axios.post(`${API_URL}/api/contact`, data);
  return response.data;
};
