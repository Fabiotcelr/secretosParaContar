import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile as updateProfileService, changePassword } from '../services/authService';

export default function Perfil() {
  const { user, isLoggedIn, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    avatarUrl: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Estados para libros dinámicos
  const [librosObtenidos, setLibrosObtenidos] = useState<any[]>([]);
  const [loadingLibros, setLoadingLibros] = useState(false);

  const audiolibros = [
    { id: 1, titulo: 'El Principito (Audio)', autor: 'Antoine de Saint-Exupéry', duracion: '2h 15m', imagen: '/images/principito.jpg' },
    { id: 2, titulo: 'Harry Potter (Audio)', autor: 'J.K. Rowling', duracion: '8h 45m', imagen: '/images/harry.jpg' }
  ];

  const blogs = [
    { id: 1, titulo: 'Mi experiencia con la lectura', fecha: '2024-03-15', likes: 24, imagen: '/images/biblioteca.avif' },
    { id: 2, titulo: 'Los mejores libros del mes', fecha: '2024-03-10', likes: 18, imagen: '/images/biblioteca.avif' }
  ];

  const listaDeseos = [
    { id: 1, titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien', precio: '$25.99', imagen: '/images/biblioteca.avif' },
    { id: 2, titulo: '1984', autor: 'George Orwell', precio: '$19.99', imagen: '/images/biblioteca.avif' }
  ];

  const donaciones = [
    { id: 1, monto: '$50.00', fecha: '2024-03-01', causa: 'Biblioteca Comunitaria', estado: 'Completada' },
    { id: 2, monto: '$25.00', fecha: '2024-02-15', causa: 'Programa de Lectura', estado: 'Completada' }
  ];

  // Actualizar formData cuando user cambie
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA4616] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }

  // Cargar libros cuando se active la pestaña
  useEffect(() => {
    if (activeTab === 'libros' && librosObtenidos.length === 0) {
      loadLibrosObtenidos();
    }
  }, [activeTab]);

  const loadLibrosObtenidos = async () => {
    try {
      setLoadingLibros(true);
      const response = await fetch('http://localhost:5084/api/books?pageSize=6');
      if (response.ok) {
        const data = await response.json();
        setLibrosObtenidos(data);
      }
    } catch (err) {
      console.error('Error al cargar libros:', err);
    } finally {
      setLoadingLibros(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateProfileService(formData);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Actualizar el contexto con los nuevos datos
      if (updateProfile) {
        updateProfile(updatedUser);
      }
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setIsChangingPassword(false);
      return;
    }

    // Validar longitud mínima
    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setIsChangingPassword(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Contraseña actualizada correctamente');
      setIsChangingPassword(false);
      
      // Limpiar formulario
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5084/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar cuenta');
      }

      // Cerrar sesión y redirigir
      logout();
      navigate('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cuenta');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: '👤' },
    { id: 'libros', label: 'Libros Obtenidos', icon: '📚' },
    { id: 'audio', label: 'Audiolibros', icon: '🎧' },
    { id: 'blogs', label: 'Mis Blogs', icon: '✍️' },
    { id: 'deseos', label: 'Lista de Deseos', icon: '❤️' },
    { id: 'donaciones', label: 'Donaciones', icon: '💝' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="space-y-6">
            {/* Información del usuario */}
            <div className="text-center mb-8">
              <img 
                src={user.avatarUrl || "/images/perfil.png"} 
                className="h-24 w-24 rounded-full object-cover border-4 border-[#FA4616] mx-auto mb-4" 
                alt="Avatar" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/perfil.png";
                }}
              />
              <h2 className="text-2xl font-bold text-[#002847]">{user.nombre}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FA4616] text-white mt-2">
                {user.rol}
              </div>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Formulario de perfil */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] ${
                    !isEditing ? 'bg-gray-50 text-gray-700' : ''
                  }`}
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  value={user.email}
                />
                <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
              </div>

              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL del avatar
                </label>
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] ${
                    !isEditing ? 'bg-gray-50 text-gray-700' : ''
                  }`}
                  placeholder="https://ejemplo.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                />
              </div>

              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoadingProfile}
                    className="flex-1 bg-[#FA4616] text-white py-2 px-4 rounded-md hover:bg-[#D72638] focus:outline-none focus:ring-2 focus:ring-[#FA4616] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        nombre: user?.nombre || '',
                        avatarUrl: user?.avatarUrl || ''
                      });
                      setError('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#FA4616] text-white py-2 px-4 rounded-md hover:bg-[#D72638] focus:outline-none focus:ring-2 focus:ring-[#FA4616]"
                >
                  Editar Perfil
                </button>
              )}
            </form>

            {/* Sección de cambio de contraseña */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPasswordForm((v) => !v)}
                className="flex items-center gap-2 text-[#002847] font-semibold mb-4 focus:outline-none"
              >
                <span>{showPasswordForm ? '▼' : '►'}</span> Cambiar Contraseña
              </button>
              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616]"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full bg-[#002847] text-white py-2 px-4 rounded-md hover:bg-[#001a2e] focus:outline-none focus:ring-2 focus:ring-[#002847] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </form>
              )}
            </div>

            {/* Sección de eliminar cuenta */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#002847] mb-4">Zona de Peligro</h3>
              <p className="text-gray-600 mb-4">
                Una vez que elimines tu cuenta, no podrás recuperarla. Esta acción es irreversible.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Eliminar Cuenta
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800 mb-4">
                    ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'libros':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Libros Obtenidos</h2>
            {loadingLibros ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FA4616] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando libros...</p>
              </div>
            ) : librosObtenidos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No tienes libros obtenidos aún</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {librosObtenidos.map((libro) => (
                  <div key={libro.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={libro.coverImageUrl || "/images/biblioteca.avif"} 
                      alt={libro.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/biblioteca.avif";
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-[#002847] mb-2">{libro.title}</h3>
                      <p className="text-gray-600 mb-2">{libro.author}</p>
                      <p className="text-sm text-gray-500">Obtenido: {new Date(libro.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Audiolibros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audiolibros.map((audio) => (
                <div key={audio.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={audio.imagen} 
                    alt={audio.titulo}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/biblioteca.avif";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#002847] mb-2">{audio.titulo}</h3>
                    <p className="text-gray-600 mb-2">{audio.autor}</p>
                    <p className="text-sm text-gray-500">Duración: {audio.duracion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'blogs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Mis Blogs</h2>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={blog.imagen} 
                      alt={blog.titulo}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/biblioteca.avif";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#002847] mb-2">{blog.titulo}</h3>
                      <p className="text-gray-600 mb-2">Publicado: {new Date(blog.fecha).toLocaleDateString()}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>❤️ {blog.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'deseos':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Lista de Deseos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listaDeseos.map((libro) => (
                <div key={libro.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={libro.imagen} 
                    alt={libro.titulo}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/biblioteca.avif";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#002847] mb-2">{libro.titulo}</h3>
                    <p className="text-gray-600 mb-2">{libro.autor}</p>
                    <p className="text-lg font-bold text-[#FA4616]">{libro.precio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'donaciones':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#002847] mb-6">Mis Donaciones</h2>
            <div className="space-y-4">
              {donaciones.map((donacion) => (
                <div key={donacion.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-[#002847] mb-2">{donacion.causa}</h3>
                      <p className="text-gray-600">Fecha: {new Date(donacion.fecha).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FA4616]">{donacion.monto}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {donacion.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FA4616] to-[#D72638] text-white p-8">
            <h1 className="text-3xl font-bold">Mi Cuenta</h1>
            <p className="text-white/90 mt-2">Gestiona tu perfil y contenido</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#FA4616] text-[#FA4616]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 