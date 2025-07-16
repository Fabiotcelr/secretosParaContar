// Tipos para TypeScript
export interface User {
  id: number;
  nombre: string;
  email: string;
  avatarUrl: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// URL base del backend
const API_BASE_URL = 'http://localhost:5084/api';

// Función para obtener el token del localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Función para guardar el token en localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Función para eliminar el token (logout)
export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// Función para obtener el usuario del localStorage
export const getUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const userData: any = JSON.parse(userStr);
    console.log('getUser - raw data from localStorage:', userData);
    
    // Mapear las propiedades del backend a nuestro modelo
    const user: User = {
      id: parseInt(userData.id || userData.Id || '0'),
      nombre: userData.nombre || userData.Nombre || '',
      email: userData.email || userData.Email || '',
      avatarUrl: userData.avatarUrl || userData.AvatarUrl || '/images/perfil.png',
      rol: userData.rol || userData.Rol || 'usuario'
    };
    
    console.log('getUser - mapped user:', user);
    return user;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Función para guardar el usuario en localStorage
export const setUser = (user: User): void => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('setUser - saved user:', user);
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Función para eliminar el usuario (logout)
export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const hasToken = token !== null;
  console.log('isAuthenticated - token exists:', hasToken);
  return hasToken;
};

// Función para hacer peticiones HTTP con headers de autorización
const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Servicio de login
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  const data: any = await response.json();
  console.log('login - response from backend:', data);
  
  // Mapear las propiedades del backend a nuestro modelo
  const user: User = {
    id: parseInt(data.user.id || data.user.Id || '0'),
    nombre: data.user.nombre || data.user.Nombre || '',
    email: data.user.email || data.user.Email || '',
    avatarUrl: data.user.avatarUrl || data.user.AvatarUrl || '/images/perfil.png',
    rol: data.user.rol || data.user.Rol || 'usuario'
  };
  
  console.log('login - mapped user:', user);
  
  // Guardar token y usuario en localStorage
  setToken(data.token);
  setUser(user);
  
  return {
    token: data.token,
    user: user
  };
};

// Servicio de registro
export const register = async (userData: RegisterRequest): Promise<void> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al registrar usuario');
  }
};

// Servicio para obtener perfil del usuario
export const getProfile = async (): Promise<User> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/me`);

  if (!response.ok) {
    throw new Error('Error al obtener perfil del usuario');
  }

  const userData: any = await response.json();
  console.log('getProfile - response from backend:', userData);
  
  // Mapear las propiedades del backend a nuestro modelo
  const user: User = {
    id: parseInt(userData.id || userData.Id || '0'),
    nombre: userData.nombre || userData.Nombre || '',
    email: userData.email || userData.Email || '',
    avatarUrl: userData.avatarUrl || userData.AvatarUrl || '/images/perfil.png',
    rol: userData.rol || userData.Rol || 'usuario'
  };
  
  console.log('getProfile - mapped user:', user);
  setUser(user); // Actualizar usuario en localStorage
  
  return user;
};

// Servicio para actualizar avatar
export const updateAvatar = async (avatarUrl: string): Promise<void> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/avatar`, {
    method: 'PUT',
    body: JSON.stringify({ avatarUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar avatar');
  }

  // Actualizar usuario en localStorage con el nuevo avatar
  const currentUser = getUser();
  if (currentUser) {
    setUser({ ...currentUser, avatarUrl });
  }
};

// Servicio para actualizar perfil
export const updateProfile = async (profileData: { nombre: string; avatarUrl?: string }): Promise<User> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al actualizar perfil');
  }

  const data: any = await response.json();
  console.log('updateProfile - response from backend:', data);
  
  // Mapear las propiedades del backend a nuestro modelo
  const user: User = {
    id: parseInt(data.user.id || data.user.Id || '0'),
    nombre: data.user.nombre || data.user.Nombre || '',
    email: data.user.email || data.user.Email || '',
    avatarUrl: data.user.avatarUrl || data.user.AvatarUrl || '/images/perfil.png',
    rol: data.user.rol || data.user.Rol || 'usuario'
  };
  
  console.log('updateProfile - mapped user:', user);
  setUser(user); // Actualizar usuario en localStorage
  
  return user;
};

// Servicio para cambiar contraseña
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/password`, {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al cambiar contraseña');
  }
};

// Servicio para eliminar cuenta
export const deleteAccount = async (): Promise<void> => {
  const response = await apiRequest(`${API_BASE_URL}/auth/account`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al eliminar cuenta');
  }
};

// Servicio de logout
export const logout = (): void => {
  try {
    console.log('Limpiando localStorage...');
    removeToken();
    removeUser();
    console.log('localStorage limpiado exitosamente');
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    // Forzar limpieza
    localStorage.clear();
  }
};