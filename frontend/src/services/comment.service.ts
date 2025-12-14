import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://thinkel.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Comment {
  _id: string;
  postId: string;
  author: {
    userId: string;
    name: string;
    avatar?: string;
  };
  content: string;
  parentId?: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentId?: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  total: number;
}

// Crear comentario
export const createComment = async (data: CreateCommentData): Promise<Comment> => {
  try {
    const response = await api.post<{ success: boolean; data: Comment }>('/comments', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el comentario');
  }
};

// Obtener comentarios de un post
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get<CommentsResponse>(`/posts/${postId}/comments`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener los comentarios');
  }
};

// Actualizar comentario
export const updateComment = async (id: string, content: string): Promise<Comment> => {
  try {
    const response = await api.put<{ success: boolean; data: Comment }>(`/comments/${id}`, { content });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el comentario');
  }
};

// Eliminar comentario
export const deleteComment = async (id: string): Promise<void> => {
  try {
    await api.delete(`/comments/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el comentario');
  }
};

// Toggle like en comentario
export const toggleLikeComment = async (id: string): Promise<{ likes: number; liked: boolean }> => {
  try {
    const response = await api.post(`/comments/${id}/like`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al dar like');
  }
};

export default {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  toggleLikeComment,
};
