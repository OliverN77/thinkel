import { useEffect, useState, useCallback } from 'react';
import type { User } from '../types';
import { getProfile } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    // Escuchar evento de actualización de perfil
    const handleProfileUpdate = () => {
      fetchUser();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [fetchUser]);

  return { user, loading, refreshUser: fetchUser };
}
