import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description,
  date,
  tags,
  author,
  thumbnail,
  slug,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      {thumbnail && (
        <Link to={`/blog/${slug}`}>
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${slug}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Author */}
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {author.name}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar size={14} />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>
        </div>
      </div>
    </article>
  );
};