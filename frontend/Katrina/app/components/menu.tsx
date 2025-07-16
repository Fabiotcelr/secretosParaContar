import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useAuth } from '../contexts/AuthContext';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  // Debug: Log user info when it changes
  useEffect(() => {
    console.log('Menu - User info:', {
      isLoading,
      isLoggedIn,
      user: user ? {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        avatarUrl: user.avatarUrl
      } : null,
      isAdmin: user?.rol === 'admin'
    });
  }, [user, isLoggedIn, isLoading]);

  // Toggle del menú hamburguesa
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle del dropdown del perfil
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (dropdownRef.current && target && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    try {
      console.log('Iniciando logout...');
      logout();
      console.log('Logout completado');
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error durante logout:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsDropdownOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="w-full">
      {/* Línea superior pequeña */}
      <div className="h-8 w-full bg-[#002847]"></div>

      <div className="bg-[#618EB4] w-full flex flex-wrap items-center justify-between mx-auto p-8">
        {/* Logotipo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/images/logoSpc.png" className="h-12" alt="Secretos para Contar Logo" />
        </Link>

        {/* Menú hamburguesa y ícono de perfil */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Ícono de perfil */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              className="flex text-sm bg-white rounded-full md:me-0 focus:ring-4 focus:ring-[#FA4616] hover:ring-2 hover:ring-[#FA4616] transition-all duration-200 shadow-md hover:shadow-lg"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
              disabled={isLoading}
            >
              <span className="sr-only">Abrir menú de usuario</span>
              {isLoading ? (
                <div className="h-10 w-10 rounded-full border-2 border-[#FA4616] bg-gray-100 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FA4616]"></div>
                </div>
              ) : (
                <img 
                  src={user?.avatarUrl || "/images/perfil.png"} 
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#FA4616]" 
                  alt="Perfil" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/perfil.png";
                  }}
                />
              )}
            </button>
            {/* Dropdown menu */}
            <div
              className={`z-50 absolute right-0 mt-3 ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} transform transition-all duration-200 ease-out text-base list-none bg-white rounded-xl shadow-xl border border-gray-100 min-w-[200px]`}
              id="user-dropdown"
            >
              {isLoading ? (
                <div className="px-4 py-4">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FA4616]"></div>
                    <span className="ml-2 text-sm text-gray-500">Cargando...</span>
                  </div>
                </div>
              ) : isLoggedIn ? (
                <>
                  <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.avatarUrl || "/images/perfil.png"} 
                        className="h-10 w-10 rounded-full object-cover border-2 border-[#FA4616]" 
                        alt="Avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/perfil.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#002847] truncate">
                          {user?.nombre || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FA4616] text-white mt-1">
                          {user?.rol || 'Usuario'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/perfil"
                        className="flex items-center px-4 py-3 text-sm text-[#002847] hover:bg-[#F8F8F8] transition-colors duration-150"
                        onClick={toggleDropdown}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/donaciones"
                        className="flex items-center px-4 py-3 text-sm text-[#002847] hover:bg-[#F8F8F8] transition-colors duration-150"
                        onClick={toggleDropdown}
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Donaciones
                      </Link>
                    </li>
                    {user?.rol === 'admin' && (
                      <li>
                        <Link
                          to="/panel-administrativo"
                          className="flex items-center px-4 py-3 text-sm text-[#002847] hover:bg-[#F8F8F8] transition-colors duration-150"
                          onClick={toggleDropdown}
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Panel Administrativo
                        </Link>
                      </li>
                    )}
                    <li className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        className="flex items-center w-full px-4 py-3 text-sm text-[#FA4616] hover:bg-red-50 transition-colors duration-150"
                        onClick={handleLogout}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </>
              ) : (
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-sm text-[#002847] hover:bg-[#F8F8F8] transition-colors duration-150"
                      onClick={toggleDropdown}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/registro"
                      className="flex items-center px-4 py-3 text-sm text-[#002847] hover:bg-[#F8F8F8] transition-colors duration-150"
                      onClick={toggleDropdown}
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Registrarse
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Botón del menú hamburguesa */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-orange rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange"
            aria-controls="navbar-user"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Abrir menú principal</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        {/* Enlaces del menú */}
        <div
          className={`absolute top-0 left-0 w-full h-auto bg-white shadow-lg transition-transform transform ${
            isMenuOpen ? 'translate-y-0 z-50' : '-translate-y-full'
          } md:relative md:translate-y-0 md:h-auto md:w-auto md:bg-transparent md:shadow-none`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-BeVietnamPro p-4 md:p-0 mt-4 border border-lightGreen rounded-lg bg-lightBeige md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/biblioteca"
                className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/biblioteca' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Biblioteca
              </Link>
            </li>
            <li>
              <Link
                to="/novedades"
                className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/novedades' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Novedades
              </Link>
            </li>
            <li>
              <Link
                to="/nosotros"
                className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/nosotros' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/donaciones"
                className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/donaciones' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Donaciones
              </Link>
            </li>
            {isLoggedIn && user?.rol === 'admin' && (
              <li>
                <Link
                  to="/panel-administrativo"
                  className={`block py-2 px-3 rounded-sm md:p-0 font-BeVietnamPro ${location.pathname === '/panel-administrativo' ? 'text-orange' : 'text-darkBlue hover:text-orange'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel Administrativo
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;