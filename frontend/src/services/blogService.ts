import axios from 'axios';

const API_URL = 'https://thinkel.onrender.com';

// Configurar interceptor para incluir token automáticamente
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// POSTS
// ============================================

/**
 * Obtener todos los posts del blog
 */
export const getAllPosts = async (params?: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/blog/posts`, { params });
  return response.data;
};

/**
 * Obtener un post individual por slug
 */
export const getPostBySlug = async (slug: string) => {
  const response = await axios.get(`${API_URL}/blog/posts/${slug}`);
  return response.data;
};

/**
 * Obtener posts de un usuario específico
 */
export const getPostsByUser = async (username: string) => {
  const response = await axios.get(`${API_URL}/blog/users/${username}/posts`);
  return response.data;
};

/**
 * Crear un nuevo post
 */
export const createPost = async (data: {
  title: string;
  content: string;
  description: string;
  tags: string[];
  thumbnail?: string;
}) => {
  const response = await axios.post(
    `${API_URL}/blog/posts`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Actualizar un post existente
 */
export const updatePost = async (
  postId: string,
  data: {
    title?: string;
    content?: string;
    description?: string;
    tags?: string[];
    thumbnail?: string;
  }
) => {
  const response = await axios.put(
    `${API_URL}/blog/posts/${postId}`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Eliminar un post
 */
export const deletePost = async (postId: string) => {
  const response = await axios.delete(
    `${API_URL}/blog/posts/${postId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Dar like a un post
 */
export const likePost = async (postId: string) => {
  const response = await axios.post(
    `${API_URL}/blog/posts/${postId}/like`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

// ============================================
// COMENTARIOS
// ============================================

/**
 * Obtener comentarios de un post
 */
export const getComments = async (postId: string) => {
  const response = await axios.get(`${API_URL}/blog/posts/${postId}/comments`);
  return response.data;
};

/**
 * Crear un comentario
 */
export const createComment = async (
  postId: string,
  data: {
    content: string;
    parentId?: string;
  }
) => {
  const response = await axios.post(
    `${API_URL}/blog/posts/${postId}/comments`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Actualizar un comentario
 */
export const updateComment = async (
  commentId: string,
  data: {
    content: string;
  }
) => {
  const response = await axios.put(
    `${API_URL}/blog/comments/${commentId}`,
    data,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Eliminar un comentario
 */
export const deleteComment = async (commentId: string) => {
  const response = await axios.delete(
    `${API_URL}/blog/comments/${commentId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Dar like a un comentario
 */
export const likeComment = async (commentId: string) => {
  const response = await axios.post(
    `${API_URL}/blog/comments/${commentId}/like`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

// ============================================
// TAGS
// ============================================

/**
 * Obtener todos los tags
 */
export const getAllTags = async () => {
  const response = await axios.get(`${API_URL}/blog/tags`);
  return response.data;
};

/**
 * Obtener posts por tag
 */
export const getPostsByTag = async (tag: string) => {
  const response = await axios.get(`${API_URL}/blog/tags/${tag}/posts`);
  return response.data;
};

// ============================================
// USUARIOS
// ============================================

/**
 * Obtener perfil de usuario
 */
export const getUserProfile = async (username: string) => {
  const response = await axios.get(`${API_URL}/blog/users/${username}`);
  return response.data;
};

/**
 * Seguir a un usuario
 */
export const followUser = async (userId: string) => {
  const response = await axios.post(
    `${API_URL}/blog/users/${userId}/follow`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Dejar de seguir a un usuario
 */
export const unfollowUser = async (userId: string) => {
  const response = await axios.delete(
    `${API_URL}/blog/users/${userId}/follow`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

// ============================================
// BÚSQUEDA
// ============================================

/**
 * Buscar posts
 */
export const searchPosts = async (query: string) => {
  const response = await axios.get(`${API_URL}/blog/search`, {
    params: { q: query },
  });
  return response.data;
};

// ============================================
// UPLOAD
// ============================================

/**
 * Subir imagen para post
 */
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(
    `${API_URL}/blog/upload`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};
