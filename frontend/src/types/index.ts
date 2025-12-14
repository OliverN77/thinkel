export interface User {
  _id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string | null;
  bio?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

// ✅ Agregar interfaces de respuestas
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}
