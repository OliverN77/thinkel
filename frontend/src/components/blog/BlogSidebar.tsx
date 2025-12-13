import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  BookOpen,
  PenSquare,
  LogOut,
  Menu,
  X,
  Heart,
  Bookmark,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
  Moon,
  Sun
} from 'lucide-react';
import { logoutUser, isAuthenticated } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

interface BlogSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    username?: string;
  };
}

export const BlogSidebar: React.FC<BlogSidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const authenticated = isAuthenticated();
  
  // Obtener user directamente desde useAuth para que se actualice automáticamente
  const { user } = useAuth();

  // Detectar tema al cargar
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logoutUser();
      navigate('/');
    }
  };

  const menuItems = [
    {
      label: 'Blog',
      icon: BookOpen,
      path: '/blog',
      show: true,
    },
    {
      label: 'Crear Artículo',
      icon: PenSquare,
      path: '/blog/create',
      show: authenticated,
    },
    {
      label: 'Mis Favoritos',
      icon: Heart,
      path: '/favorites',
      show: authenticated,
    },
    {
      label: 'Guardados',
      icon: Bookmark,
      path: '/saved',
      show: authenticated,
    },
    {
      label: 'Trending',
      icon: TrendingUp,
      path: '/blog?sort=trending',
      show: true,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Botón móvil para abrir sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-900 hover:bg-gray-50'
        }`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-40 flex flex-col flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
          ${theme === 'dark' 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
          }
          border-r
        `}
      >
        {/* Botón toggle para desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden lg:flex absolute -right-3 top-8 w-6 h-6 border rounded-full 
            items-center justify-center transition-colors shadow-sm z-10
            ${theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }
          `}
          title={isCollapsed ? 'Expandir' : 'Contraer'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header del Sidebar */}
        <div className={`p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          {authenticated && user ? (
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              {user.avatar ? (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  title={isCollapsed ? user.name : ''}
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0"
                  title={isCollapsed ? user.name : ''}
                >
                  <User size={24} className="text-white" />
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center ${isCollapsed ? 'px-0' : ''}`}>
              {!isCollapsed ? (
                <>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Thinkel Blog
                  </h2>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Bienvenido
                  </p>
                </>
              ) : (
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              if (!item.show) return null;

              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isCollapsed ? 'justify-center' : ''}
                      ${active
                        ? theme === 'dark'
                          ? 'bg-blue-900 text-blue-300 font-medium'
                          : 'bg-blue-50 text-blue-600 font-medium'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          {authenticated && (
            <div className={`my-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
          )}

          {/* Opciones adicionales */}
          {authenticated && (
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive('/dashboard')
                      ? theme === 'dark'
                        ? 'bg-blue-900 text-blue-300 font-medium'
                        : 'bg-blue-50 text-blue-600 font-medium'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                  title={isCollapsed ? 'Configuración' : ''}
                >
                  <LayoutDashboard size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span>Configuración</span>}
                </Link>
              </li>

              {/* Botón de tema */}
              <li>
                <button
                  onClick={toggleTheme}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                  title={isCollapsed ? (theme === 'dark' ? 'Modo claro' : 'Modo oscuro') : ''}
                >
                  {theme === 'dark' ? (
                    <Sun size={20} className="flex-shrink-0" />
                  ) : (
                    <Moon size={20} className="flex-shrink-0" />
                  )}
                  {!isCollapsed && <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${theme === 'dark'
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-red-600 hover:bg-red-50'
                    }
                  `}
                  title={isCollapsed ? 'Cerrar Sesión' : ''}
                >
                  <LogOut size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span>Cerrar Sesión</span>}
                </button>
              </li>
            </ul>
          )}
        </nav>

        {/* Footer del Sidebar */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {!authenticated ? (
            <div className="space-y-2">
              {!isCollapsed ? (
                <>
                  <Link
                    to="/form"
                    className={`block w-full px-4 py-2 text-center rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/form"
                    className={`block w-full px-4 py-2 text-center border rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <Link
                  to="/form"
                  className="flex justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Iniciar Sesión"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          ) : (
            !isCollapsed && (
              <div className={`text-center text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                <p>© 2025 Thinkel</p>
                <p className="mt-1">Versión 1.0.0</p>
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
};