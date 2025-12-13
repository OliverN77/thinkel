export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}