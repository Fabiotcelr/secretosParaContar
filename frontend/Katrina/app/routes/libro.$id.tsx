import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@remix-run/react';

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

export default function LibroDetalle() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5084/api/books/${id}`);

      if (!response.ok) {
        throw new Error('Libro no encontrado');
      }

      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el libro');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA4616] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando libro...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Libro no encontrado'}</p>
          <Link
            to="/biblioteca"
            className="bg-[#FA4616] text-white px-6 py-2 rounded-md hover:bg-[#D72638]"
          >
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    book.coverImageUrl || "/images/biblioteca.avif"
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#FA4616]">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/biblioteca" className="hover:text-[#FA4616]">Biblioteca</Link>
            </li>
            <li>/</li>
            <li className="text-[#002847] font-medium">{book.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/biblioteca.avif";
                  }}
                />
              </div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-[#FA4616]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${book.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/biblioteca.avif";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              {/* Título y autor */}
              <div>
                <h1 className="text-3xl font-bold text-[#002847] mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">por {book.author}</p>
              </div>

              {/* Rating */}
              {book.rating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">({book.rating.toFixed(1)})</span>
                  <span className="text-gray-500">• {book.reviewCount} reseñas</span>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#FA4616] text-white">
                  {book.format}
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-[#002847] text-white">
                  {book.category}
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  {book.language}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg font-semibold text-[#002847] mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Detalles técnicos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#002847] mb-3">Detalles del producto</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{book.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Editorial:</span>
                      <span className="font-medium">{book.publisher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Edición:</span>
                      <span className="font-medium">{book.edition}</span>
                    </div>
                    {book.pages && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Páginas:</span>
                        <span className="font-medium">{book.pages}</span>
                      </div>
                    )}
                    {book.chapters && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capítulos:</span>
                        <span className="font-medium">{book.chapters}</span>
                      </div>
                    )}
                    {book.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensiones:</span>
                        <span className="font-medium">{book.dimensions}</span>
                      </div>
                    )}
                    {book.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peso:</span>
                        <span className="font-medium">{book.weight}g</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#002847] mb-3">Disponibilidad</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-medium ${book.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.quantity > 0 ? `${book.quantity} disponibles` : 'No disponible'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium ${book.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {book.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha de publicación:</span>
                      <span className="font-medium">
                        {new Date(book.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                {book.quantity > 0 && book.isActive ? (
                  <div className="space-y-3">
                    <button className="w-full bg-[#FA4616] text-white py-3 px-6 rounded-lg hover:bg-[#D72638] transition-colors duration-200 font-semibold">
                      Obtener Libro
                    </button>
                    
                    {book.bookFileUrl && (
                      <a
                        href={book.bookFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#002847] text-white py-3 px-6 rounded-lg hover:bg-[#001a2e] transition-colors duration-200 font-semibold text-center"
                      >
                        Descargar PDF
                      </a>
                    )}
                    
                    {book.audioFileUrl && (
                      <a
                        href={book.audioFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold text-center"
                      >
                        Escuchar Audiolibro
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-semibold mb-2">Libro no disponible</p>
                    <p className="text-gray-600 text-sm">
                      Este libro no está disponible actualmente
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    ❤️ Lista de deseos
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    📤 Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del autor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#002847] mb-4">Sobre el autor</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-500">👤</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{book.author}</h4>
                <p className="text-gray-600">Autor reconocido</p>
              </div>
            </div>
          </div>

          {/* Información de la editorial */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#002847] mb-4">Editorial</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-500">🏢</span>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{book.publisher}</h4>
                <p className="text-gray-600">Editorial de prestigio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <Link
            to="/biblioteca"
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <span>←</span>
            <span>Volver a la biblioteca</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 