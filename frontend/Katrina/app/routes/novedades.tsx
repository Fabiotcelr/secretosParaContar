// filepath: c:\secretosParaContar\frontend\Katrina\app\routes\nvedades.tsx
import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";

interface Blog {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  coverImageUrl?: string;
  author?: string;
  category?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  publishedAt?: string;
}

export default function Novedades() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadBlogs();
    loadCategories();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5084/api/blog');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
        // Los primeros 3 blogs serán destacados
        setFeaturedBlogs(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error cargando blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:5084/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = !selectedCategory || blog.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.subtitle && blog.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            📚 Novedades y Artículos
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Descubre las últimas noticias, historias y artículos sobre nuestra fundación, 
            la promoción de la lectura y el impacto en la comunidad.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 rounded-full focus:outline-none focus:ring-4 focus:ring-white/20"
              />
              <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ✨ Artículos Destacados
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog, index) => (
                <div key={blog.id} className="group cursor-pointer">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative">
                      <img 
                        src={blog.coverImageUrl || "/images/biblioteca.avif"} 
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/biblioteca.avif";
                        }}
                      />
                      {blog.category && (
                        <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      {blog.subtitle && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {blog.subtitle}
                        </p>
                      )}
                      <p className="text-gray-700 mb-4">
                        {truncateText(blog.content, 120)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{blog.author || 'Fundación'}</span>
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <span className="flex items-center mr-4">
                          👁️ {blog.viewCount} vistas
                        </span>
                        <span className="flex items-center">
                          ❤️ {blog.likeCount} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === '' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Blogs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory ? `Artículos de ${selectedCategory}` : 'Todos los Artículos'}
            </h2>
            <span className="text-gray-600">
              {filteredBlogs.length} artículo{filteredBlogs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron artículos
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No hay artículos que coincidan con "${searchTerm}"`
                  : 'No hay artículos disponibles en esta categoría'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article key={blog.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={blog.coverImageUrl || "/images/biblioteca.avif"} 
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/biblioteca.avif";
                      }}
                    />
                    {blog.category && (
                      <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.subtitle && (
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                        {blog.subtitle}
                      </p>
                    )}
                    <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                      {truncateText(blog.content, 100)}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium">{blog.author || 'Fundación'}</span>
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {blog.viewCount}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {blog.likeCount}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        Leer más →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            📧 Mantente Informado
          </h2>
          <p className="text-xl mb-8">
            Suscríbete para recibir las últimas novedades y artículos de nuestra fundación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}