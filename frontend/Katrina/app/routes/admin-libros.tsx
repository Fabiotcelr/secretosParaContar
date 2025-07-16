import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuth } from '../contexts/AuthContext';

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

interface Book {
  id: number;
  sku: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  quantity: number;
  format: string;
  edition: string;
  language: string;
  pages?: number;
  chapters?: number;
  description: string;
  dimensions?: string;
  weight?: string;
  coverImageUrl?: string;
  bookFileUrl?: string;
  audioFileUrl?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminLibros() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el listado
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Estados para el formulario
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    authorId: '',
    publisher: '',
    category: '',
    quantity: 0,
    format: '',
    edition: '',
    language: '',
    pages: '',
    chapters: '',
    description: '',
    dimensions: '',
    weight: '',
    coverImageUrl: '',
    bookFileUrl: '',
    audioFileUrl: ''
  });

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

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.rol !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.rol === 'admin') {
      loadBooks();
      loadAuthors();
    }
  }, [user, currentPage, searchTerm, selectedCategory, selectedFormat, selectedLanguage, showActiveOnly]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: '12'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedFormat) params.append('format', selectedFormat);
      if (selectedLanguage) params.append('language', selectedLanguage);

      const response = await fetch(`http://localhost:5084/api/books?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar libros');

      const data = await response.json();
      setBooks(data);
      
      // Obtener headers de paginación
      const totalCount = response.headers.get('X-Total-Count');
      const pageSize = response.headers.get('X-PageSize');
      
      if (totalCount && pageSize) {
        setTotalCount(parseInt(totalCount));
        setTotalPages(Math.ceil(parseInt(totalCount) / parseInt(pageSize)));
      }
    } catch (err) {
      setError('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5084/api/authors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
      }
    } catch (err) {
      console.error('Error al cargar autores:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5084/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...formData,
          authorId: parseInt(formData.authorId),
          quantity: parseInt(formData.quantity),
          pages: formData.pages ? parseInt(formData.pages) : null,
          chapters: formData.chapters ? parseInt(formData.chapters) : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear libro');
      }

      setSuccess('Libro creado exitosamente');
      setShowForm(false);
      resetForm();
      loadBooks();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear libro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      title: '',
      authorId: '',
      publisher: '',
      category: '',
      quantity: 0,
      format: '',
      edition: '',
      language: '',
      pages: '',
      chapters: '',
      description: '',
      dimensions: '',
      weight: '',
      coverImageUrl: '',
      bookFileUrl: '',
      audioFileUrl: ''
    });
  };

  const toggleBookStatus = async (bookId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5084/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      if (response.ok) {
        setBooks(books.map(book => 
          book.id === bookId 
            ? { ...book, isActive: !currentStatus }
            : book
        ));
        setSuccess(`Libro ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al cambiar estado del libro');
    }
  };

  const deleteBook = async (bookId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;

    try {
      const response = await fetch(`http://localhost:5084/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== bookId));
        setSuccess('Libro eliminado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error al eliminar libro');
    }
  };

  if (!user || user.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#002847]">Gestión de Libros</h1>
              <p className="text-gray-600 mt-2">Administra el catálogo de libros</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#FA4616] text-white px-6 py-3 rounded-lg hover:bg-[#D72638] transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Libro'}
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Crear Nuevo Libro</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                <input
                  type="text"
                  name="sku"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Autor *</label>
                <select
                  name="authorId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.authorId}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar autor</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.firstName} {author.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editorial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Editorial *</label>
                <input
                  type="text"
                  name="publisher"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.publisher}
                  onChange={handleChange}
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato *</label>
                <select
                  name="format"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.format}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar formato</option>
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              {/* Edición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edición *</label>
                <input
                  type="text"
                  name="edition"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.edition}
                  onChange={handleChange}
                />
              </div>

              {/* Idioma */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma *</label>
                <select
                  name="language"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar idioma</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Páginas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Páginas</label>
                <input
                  type="number"
                  name="pages"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.pages}
                  onChange={handleChange}
                />
              </div>

              {/* Capítulos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capítulos</label>
                <input
                  type="number"
                  name="chapters"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.chapters}
                  onChange={handleChange}
                />
              </div>

              {/* Dimensiones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensiones</label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="15 x 23 cm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.dimensions}
                  onChange={handleChange}
                />
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (g)</label>
                <input
                  type="text"
                  name="weight"
                  placeholder="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              {/* URL de portada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de portada</label>
                <input
                  type="url"
                  name="coverImageUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                />
              </div>

              {/* URL del libro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL del libro</label>
                <input
                  type="url"
                  name="bookFileUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.bookFileUrl}
                  onChange={handleChange}
                />
              </div>

              {/* URL del audio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL del audio</label>
                <input
                  type="url"
                  name="audioFileUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.audioFileUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Botones */}
              <div className="md:col-span-2 lg:col-span-3 flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#FA4616] text-white py-3 px-6 rounded-md hover:bg-[#D72638] focus:outline-none focus:ring-2 focus:ring-[#FA4616] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando...' : 'Crear Libro'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros y búsqueda */}
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
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
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
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                value={showActiveOnly ? 'active' : 'all'}
                onChange={(e) => setShowActiveOnly(e.target.value === 'active')}
              >
                <option value="active">Solo activos</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listado de libros */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#002847]">
              Inventario ({totalCount} libros)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA4616] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando libros...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No se encontraron libros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Libro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded object-cover"
                              src={book.coverImageUrl || "/images/biblioteca.avif"}
                              alt={book.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {book.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleBookStatus(book.id, book.isActive)}
                            className={`px-3 py-1 rounded text-xs ${
                              book.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {book.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="px-3 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 