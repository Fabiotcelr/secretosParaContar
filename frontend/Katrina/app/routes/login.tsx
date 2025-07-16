import React, { useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { login, LoginRequest } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

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
    
    try {
      const response = await login(formData);
      // Actualizar el contexto de autenticación
      loginContext(response.user);
      // Navegar a la página principal después del login exitoso
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
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
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/register" 
              className="font-medium text-[#FA4616] hover:text-[#D72638]"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#FA4616] focus:border-[#FA4616] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
