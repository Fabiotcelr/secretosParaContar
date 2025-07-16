import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

interface Book {
  Id: number;
  SKU: string;
  Title: string;
  Author: string;
  Publisher: string;
  Category: string;
  Quantity: number;
  Format: string;
  Edition: string;
  Language: string;
  Pages?: number;
  Chapters?: number;
  Description: string;
  Dimensions?: string;
  Weight?: string;
  CoverImageUrl?: string;
  Rating: number;
  ReviewCount: number;
  IsActive: boolean;
  CreatedAt: string;
}

export default function Biblioteca() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Categorías predefinidas
  const categories = [
    'Ficción', 'No ficción', 'Ciencia ficción', 'Fantasía', 'Misterio', 'Thriller', 
    'Romance', 'Biografía', 'Historia', 'Autoayuda', 'Psicología', 'Desarrollo personal', 
    'Aventura', 'Terror', 'Infantil', 'Juvenil', 'Poesía', 'Ensayo', 'Filosofía', 
    'Ciencia', 'Tecnología', 'Economía', 'Política', 'Religión', 'Espiritualidad', 
    'Arte', 'Fotografía', 'Cocina', 'Viajes', 'Humor', 'Educación', 'Medicina', 
    'Derecho', 'Criminología', 'Negocios', 'Finanzas', 'Informática', 'Programación', 
    'Arquitectura', 'Diseño', 'Ecología', 'Deportes', 'Música'
  ];

  const formats = ['Impreso', 'Digital', 'Audiolibro', 'E-book', 'PDF'];
  const languages = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Otros'];

  // Cargar libros
  useEffect(() => {
    loadBooks();
  }, [currentPage, searchTerm, selectedCategory, selectedFormat, selectedLanguage]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '12'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedFormat) params.append('format', selectedFormat);
      if (selectedLanguage) params.append('language', selectedLanguage);

      const url = `http://localhost:5084/api/books?${params}`;
      console.log('Haciendo petición a:', url);

      const response = await fetch(url);

      console.log('Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en respuesta:', errorText);
        throw new Error(`Error al cargar libros: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validar que data sea un array
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error('Los datos recibidos no son un array:', data);
        setBooks([]);
        setError('Formato de datos incorrecto');
        return;
      }
      
      // Obtener headers de paginación
      const totalCount = response.headers.get('X-Total-Count');
      const pageSize = response.headers.get('X-PageSize');
      
      if (totalCount && pageSize) {
        setTotalCount(parseInt(totalCount));
        setTotalPages(Math.ceil(parseInt(totalCount) / parseInt(pageSize)));
      } else {
        // Fallback: usar la longitud del array si no hay headers
        setTotalCount(data.length);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(`Error al cargar los libros: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedFormat('');
    setSelectedLanguage('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#002847] mb-4">Biblioteca Digital</h1>
          <p className="text-xl text-gray-600">Descubre miles de libros en nuestro catálogo</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Título, autor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] text-gray-700"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {categories.map((category, index) => (
                  <option key={`category-${index}`} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Formato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] text-gray-700"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="">Todos</option>
                {formats.map((format, index) => (
                  <option key={`format-${index}`} value={format}>{format}</option>
                ))}
              </select>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] text-gray-700"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">Todos</option>
                {languages.map((language, index) => (
                  <option key={`language-${index}`} value={language}>{language}</option>
                ))}
              </select>
            </div>

            {/* Botón limpiar */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#002847]">
              {loading ? 'Cargando...' : `${totalCount} libros encontrados`}
            </h2>
          </div>
        </div>

        {/* Grid de libros */}
        {(() => {
          if (loading) {
            return (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA4616] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando libros...</p>
              </div>
            );
          }
          
          if (error) {
            return (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadBooks}
                  className="mt-4 bg-[#FA4616] text-white px-6 py-2 rounded-md hover:bg-[#D72638]"
                >
                  Reintentar
                </button>
              </div>
            );
          }
          
          if (!books || books.length === 0) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron libros</p>
              </div>
            );
          }
          
          return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books && books.length > 0 ? books.map((book, index) => (
              <div key={book.Id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Imagen */}
                <div className="relative h-64 bg-gray-100">
                  <img 
                    src={book.CoverImageUrl || "/images/biblioteca.avif"} 
                    alt={book.Title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/biblioteca.avif";
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#FA4616] text-white">
                      {book.Format}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#002847] text-white">
                      {book.Category}
                    </span>
                  </div>
                  {/* Rating */}
                  {book.Rating > 0 && (
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold ml-1">{book.Rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#002847] mb-2 line-clamp-2">
                    {book.Title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">por {book.Author || 'Autor no disponible'}</p>
                  <p className="text-gray-500 text-xs mb-3">{book.Publisher}</p>
                  
                  {/* Detalles */}
                  <div className="space-y-1 mb-4">
                    {book.Pages && (
                      <p className="text-xs text-gray-500">📄 {book.Pages} páginas</p>
                    )}
                    {book.Language && (
                      <p className="text-xs text-gray-500">🌍 {book.Language}</p>
                    )}
                  </div>

                  {/* Botón */}
                  <Link
                    to={`/libro/${book.Id}`}
                    className="block w-full bg-[#FA4616] text-white text-center py-2 px-4 rounded-md hover:bg-[#D72638] transition-colors duration-200"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No hay libros disponibles</p>
              </div>
            )}
          </div>
        );
        })()}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-[#FA4616] text-white border-[#FA4616]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}