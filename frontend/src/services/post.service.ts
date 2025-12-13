import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configurar axios para incluir el token en cada petición
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada petición
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

// Tipos
export interface CreatePostData {
  title: string;
  content: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  published?: boolean;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  thumbnail?: string;
  author: {
    bio: string;
    userId: string;
    name: string;
    username: string;
    avatar?: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  likedBy: string[];
  bookmarkedBy: string[];
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SinglePostResponse {
  success: boolean;
  data: Post;
}

// Crear nuevo post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  try {
    const response = await api.post<SinglePostResponse>('/posts', data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el post');
  }
};

// Obtener todos los posts
export const getPosts = async (params?: {
  page?: number;
  limit?: number;
  tag?: string;
  author?: string;
  search?: string;
  sort?: string;
}): Promise<PostsResponse> => {
  try {
    const response = await api.get<PostsResponse>('/posts', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener los posts');
  }
};

// Obtener un post por slug
export const getPostBySlug = async (slug: string): Promise<Post> => {
  try {
    const response = await api.get<SinglePostResponse>(`/posts/slug/${slug}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el post');
  }
};

// Obtener un post por ID
export const getPostById = async (id: string): Promise<Post> => {
  try {
    const response = await api.get<SinglePostResponse>(`/posts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el post');
  }
};

// Actualizar post
export const updatePost = async (id: string, data: UpdatePostData): Promise<Post> => {
  try {
    const response = await api.put<SinglePostResponse>(`/posts/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el post');
  }
};

// Eliminar post
export const deletePost = async (id: string): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el post');
  }
};

// Toggle like
export const toggleLike = async (id: string): Promise<{ likes: number; liked: boolean }> => {
  try {
    const response = await api.post(`/posts/${id}/like`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al dar like');
  }
};

// Toggle bookmark
export const toggleBookmark = async (id: string): Promise<{ bookmarked: boolean }> => {
  try {
    const response = await api.post(`/posts/${id}/bookmark`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al guardar');
  }
};

// Obtener mis posts
export const getMyPosts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PostsResponse> => {
  try {
    const response = await api.get<PostsResponse>('/posts/my/all', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener tus posts');
  }
};

// Obtener posts guardados
export const getBookmarkedPosts = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PostsResponse> => {
  try {
    const response = await api.get<PostsResponse>('/posts/my/bookmarked', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener posts guardados');
  }
};

// Obtener estadísticas del usuario
export const getUserStats = async (): Promise<{
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  savedPosts: number;
}> => {
  try {
    const response = await api.get('/posts/my/stats');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
  }
};

export default {
  createPost,
  getPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  getMyPosts,
  getBookmarkedPosts,
  getUserStats,
};
