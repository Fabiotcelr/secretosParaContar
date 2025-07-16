import React, { useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { register, RegisterRequest } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const registerData: RegisterRequest = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        avatarUrl: formData.avatarUrl || undefined
      };
      
      await register(registerData);
      setSuccess('Usuario registrado correctamente. Redirigiendo al login...');
      
      // Navegar a login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img 
            className="mx-auto h-16 w-auto" 
            src="/images/logoSpc.png" 
            alt="Secretos para Contar" 
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#002847]">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className="font-medium text-[#FA4616] hover:text-[#D72638]"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] sm:text-sm"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] sm:text-sm"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] sm:text-sm"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                URL del avatar (opcional)
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] sm:text-sm"
                placeholder="https://ejemplo.com/avatar.jpg"
                value={formData.avatarUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FA4616] hover:bg-[#D72638] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA4616] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/" 
              className="font-medium text-[#002847] hover:text-[#FA4616]"
            >
              Volver al inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
