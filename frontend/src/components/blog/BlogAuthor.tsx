import React from 'react';
import { User, Mail, Linkedin, Github, Twitter, Globe } from 'lucide-react';

interface SocialLinks {
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

interface BlogAuthorProps {
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
  profileUrl?: string;
  socialLinks?: SocialLinks;
  academicInfo?: string;
  isDark?: boolean;
}

export const BlogAuthor: React.FC<BlogAuthorProps> = ({
  name,
  role = 'Autor',
  bio,
  avatar,
  profileUrl,
  socialLinks,
  academicInfo,
  isDark = false,
}) => {
  return (
    <div className={`rounded-xl p-6 border shadow-sm ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
    }`}>
      {/* Título */}
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        <User size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        Sobre el autor
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className={`w-24 h-24 rounded-full object-cover border-4 shadow-md ${
                isDark ? 'border-gray-700' : 'border-white'
              }`}
            />
          ) : (
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center border-4 shadow-md ${
              isDark ? 'border-gray-700' : 'border-white'
            }`}>
              <User size={40} className="text-white" />
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 space-y-3">
          {/* Nombre y rol */}
          <div>
            {profileUrl ? (
              <a
                href={profileUrl}
                className={`text-xl font-bold transition-colors ${
                  isDark 
                    ? 'text-white hover:text-blue-400' 
                    : 'text-gray-900 hover:text-blue-600'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            ) : (
              <h4 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{name}</h4>
            )}
            <p className={`text-sm font-medium ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>{role}</p>
          </div>

          {/* Bio */}
          {bio && (
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{bio}</p>
          )}

          {/* Información académica */}
          {academicInfo && (
            <div className={`rounded-lg p-3 border ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-blue-100'
            }`}>
              <p className={`text-xs font-semibold mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Formación académica
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>{academicInfo}</p>
            </div>
          )}

          {/* Redes sociales */}
          {socialLinks && Object.keys(socialLinks).length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  title="Email"
                >
                  <Mail size={16} />
                  <span className="hidden sm:inline">Email</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  title="GitHub"
                >
                  <Github size={16} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  title="Twitter"
                >
                  <Twitter size={16} />
                  <span className="hidden sm:inline">Twitter</span>
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  title="Sitio web"
                >
                  <Globe size={16} />
                  <span className="hidden sm:inline">Web</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};