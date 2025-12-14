import React from 'react';
import { BlogSidebar } from './BlogSidebar';
import { isAuthenticated } from '../../services/auth.service';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const authenticated = isAuthenticated();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - solo si está autenticado y showSidebar es true */}
      {authenticated && showSidebar && (
        <BlogSidebar />
      )}

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
