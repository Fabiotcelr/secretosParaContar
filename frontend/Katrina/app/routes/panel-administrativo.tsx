// filepath: c:\secretosParaContar\frontend\Katrina\app\routes\panelA-administrativo.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@remix-run/react';

interface DashboardData {
  totalBooks: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalDonations: number;
  totalDonationAmount: number;
  booksByCategory: Array<{ category: string; count: number }>;
  usersByRole: Array<{ role: string; count: number }>;
  popularBooks: Array<{ title: string; rating: number; reviewCount: number }>;
  donationsByBook: Array<{ bookId: number; count: number; totalAmount: number }>;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Datos simulados para el dashboard
const mockDashboardData: DashboardData = {
  totalBooks: 1250,
  totalUsers: 3420,
  newUsersThisMonth: 156,
  totalDonations: 89,
  totalDonationAmount: 15420.50,
  booksByCategory: [
    { category: 'Ficción', count: 450 },
    { category: 'No Ficción', count: 320 },
    { category: 'Infantil', count: 280 },
    { category: 'Educativo', count: 200 }
  ],
  usersByRole: [
    { role: 'usuario', count: 2800 },
    { role: 'admin', count: 5 },
    { role: 'donador', count: 615 }
  ],
  popularBooks: [
    { title: 'El Principito', rating: 4.8, reviewCount: 156 },
    { title: 'Harry Potter y la Piedra Filosofal', rating: 4.9, reviewCount: 203 },
    { title: 'El Señor de los Anillos', rating: 4.7, reviewCount: 189 },
    { title: '1984', rating: 4.6, reviewCount: 142 },
    { title: 'Cien años de soledad', rating: 4.5, reviewCount: 98 }
  ],
  donationsByBook: [
    { bookId: 1, count: 45, totalAmount: 2250 },
    { bookId: 2, count: 38, totalAmount: 1900 },
    { bookId: 3, count: 32, totalAmount: 1600 },
    { bookId: 4, count: 28, totalAmount: 1400 }
  ]
};

// Datos simulados para usuarios
const mockUsers: User[] = [
  {
    id: 1,
    nombre: 'Fabio Torres',
    email: 'fitorres1607@gmail.com',
    rol: 'admin',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-03-29T14:20:00Z'
  },
  {
    id: 2,
    nombre: 'María González',
    email: 'maria.gonzalez@email.com',
    rol: 'usuario',
    isActive: true,
    createdAt: '2024-02-20T09:15:00Z',
    lastLoginAt: '2024-03-28T16:45:00Z'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    rol: 'donador',
    isActive: true,
    createdAt: '2024-01-10T11:20:00Z',
    lastLoginAt: '2024-03-29T10:30:00Z'
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    rol: 'usuario',
    isActive: true,
    createdAt: '2024-03-01T14:00:00Z',
    lastLoginAt: '2024-03-27T13:15:00Z'
  },
  {
    id: 5,
    nombre: 'Luis Pérez',
    email: 'luis.perez@email.com',
    rol: 'donador',
    isActive: false,
    createdAt: '2024-02-05T08:45:00Z',
    lastLoginAt: '2024-03-20T17:30:00Z'
  },
  {
    id: 6,
    nombre: 'Sofia Herrera',
    email: 'sofia.herrera@email.com',
    rol: 'usuario',
    isActive: true,
    createdAt: '2024-03-15T12:30:00Z',
    lastLoginAt: '2024-03-29T09:15:00Z'
  },
  {
    id: 7,
    nombre: 'Diego Morales',
    email: 'diego.morales@email.com',
    rol: 'donador',
    isActive: true,
    createdAt: '2024-02-28T15:45:00Z',
    lastLoginAt: '2024-03-28T11:20:00Z'
  },
  {
    id: 8,
    nombre: 'Carmen Silva',
    email: 'carmen.silva@email.com',
    rol: 'usuario',
    isActive: true,
    createdAt: '2024-03-10T10:20:00Z',
    lastLoginAt: '2024-03-26T14:30:00Z'
  },
  {
    id: 9,
    nombre: 'Roberto Jiménez',
    email: 'roberto.jimenez@email.com',
    rol: 'usuario',
    isActive: true,
    createdAt: '2024-03-20T16:15:00Z',
    lastLoginAt: '2024-03-29T08:45:00Z'
  },
  {
    id: 10,
    nombre: 'Patricia López',
    email: 'patricia.lopez@email.com',
    rol: 'donador',
    isActive: true,
    createdAt: '2024-02-15T13:30:00Z',
    lastLoginAt: '2024-03-28T15:20:00Z'
  }
];

export default function PanelAdministrativo() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (user?.rol !== 'admin') {
      navigate('/');
      return;
    }

    loadDashboardData();
    loadUsers();
  }, [isLoggedIn, user, navigate]);

  const loadDashboardData = async () => {
    try {
      console.log('Cargando datos del dashboard...');
      const response = await fetch('http://localhost:5084/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        console.log('Datos del dashboard recibidos:', data);
        
        // Mapear los datos del backend al formato esperado
        const mappedData: DashboardData = {
          totalBooks: data.totalBooks || 0,
          totalUsers: data.totalUsers || 0,
          newUsersThisMonth: data.newUsersThisMonth || 0,
          totalDonations: data.totalDonations || 0,
          totalDonationAmount: data.totalDonationAmount || 0,
          booksByCategory: data.booksByCategory || [],
          usersByRole: data.usersByRole || [],
          popularBooks: data.popularBooks || [],
          donationsByBook: data.donationsByBook || []
        };
        
        setDashboardData(mappedData);
      } else {
        console.log('Endpoint dashboard no disponible, usando datos simulados');
        setDashboardData(mockDashboardData);
      }
    } catch (error) {
      console.error('Error cargando dashboard, usando datos simulados:', error);
      setDashboardData(mockDashboardData);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Cargando usuarios...');
      let url = 'http://localhost:5084/api/admin/users';
      const params = new URLSearchParams();
      
      if (userRoleFilter) params.append('role', userRoleFilter);
      if (userSearch) params.append('search', userSearch);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('URL de usuarios:', url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Usuarios recibidos del backend:', data);
        
        // Mapear los datos del backend al formato esperado
        const mappedUsers: User[] = data.map((user: any) => ({
          id: user.Id,
          nombre: user.Nombre,
          email: user.Email,
          rol: user.Rol,
          isActive: user.IsActive,
          createdAt: user.CreatedAt,
          lastLoginAt: user.LastLoginAt
        }));
        
        setUsers(mappedUsers);
      } else {
        console.log('Endpoint usuarios no disponible, usando datos simulados');
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Error cargando usuarios, usando datos simulados:', error);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`http://localhost:5084/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ rol: newRole }),
      });

      if (response.ok) {
        console.log(`Rol actualizado para usuario ${userId} a ${newRole}`);
        loadUsers(); // Recargar lista
        loadDashboardData(); // Actualizar estadísticas
      } else {
        console.error('Error actualizando rol:', response.statusText);
      }
    } catch (error) {
      console.error('Error actualizando rol:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'donador': return 'bg-green-100 text-green-800';
      case 'lector': return 'bg-blue-100 text-blue-800';
      case 'usuario': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn || user?.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestión completa de la fundación
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Bienvenido, {user?.nombre}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: '📊' },
              { id: 'usuarios', name: 'Usuarios', icon: '👥' },
              { id: 'blogs', name: 'Blogs', icon: '📝' },
              { id: 'donaciones', name: 'Donaciones', icon: '💝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab data={dashboardData} />
        )}

        {activeTab === 'usuarios' && (
          <UsuariosTab 
            users={users}
            loading={loading}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            onSearch={loadUsers}
            onUpdateRole={updateUserRole}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogsTab />
        )}

        {activeTab === 'donaciones' && (
          <DonacionesTab />
        )}
      </div>
    </div>
  );
}

// Componente Dashboard
function DashboardTab({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Colores para las categorías
  const categoryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  // Colores para los roles
  const roleColors = ['#3B82F6', '#EF4444', '#10B981'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📚</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Libros
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.totalBooks?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Usuarios
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.totalUsers?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">🆕</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Nuevos (Mes)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.newUsersThisMonth?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">💝</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Donaciones
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(data.totalDonationAmount || 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Libros por Categoría */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Libros por Categoría</h3>
          <div className="space-y-4">
            {(data.booksByCategory || []).map((item: any, index: number) => {
              const percentage = (item.count / (data.totalBooks || 1)) * 100;
              const color = categoryColors[index % categoryColors.length];
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.category || 'Sin categoría'}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% del total
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usuarios por Rol */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usuarios por Rol</h3>
          <div className="space-y-4">
            {(data.usersByRole || []).map((item: any, index: number) => {
              const percentage = (item.count / (data.totalUsers || 1)) * 100;
              const color = roleColors[index % roleColors.length];
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{item.role}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% del total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Libros Populares */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Libros Más Populares</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reseñas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularidad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data.popularBooks || []).map((book: any, index: number) => {
                const popularity = (book.rating * book.reviewCount) / 100;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1">{book.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.reviewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                            style={{ width: `${Math.min(popularity * 10, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{popularity.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de Donaciones por Libro */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Donaciones por Libro</h3>
        <div className="space-y-4">
          {(data.donationsByBook || []).map((item: any, index: number) => {
            const maxAmount = Math.max(...(data.donationsByBook || []).map((d: any) => d.totalAmount));
            const percentage = (item.totalAmount / maxAmount) * 100;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Libro #{item.bookId}</span>
                    <div className="text-xs text-gray-500">{item.count} donaciones</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-600">${item.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}% del máximo</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Crecimiento Mensual</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usuarios nuevos</span>
              <span className="text-sm font-medium text-green-600">+{data.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Crecimiento</span>
              <span className="text-sm font-medium text-green-600">
                +{((data.newUsersThisMonth / (data.totalUsers || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Promedio de Donaciones</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monto promedio</span>
              <span className="text-sm font-medium text-blue-600">
                ${((data.totalDonationAmount || 0) / (data.totalDonations || 1)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total donaciones</span>
              <span className="text-sm font-medium text-blue-600">{data.totalDonations}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Ratio Libros/Usuario</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Libros por usuario</span>
              <span className="text-sm font-medium text-orange-600">
                {((data.totalBooks || 0) / (data.totalUsers || 1)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cobertura</span>
              <span className="text-sm font-medium text-orange-600">
                {Math.min(((data.totalBooks || 0) / (data.totalUsers || 1)) * 100, 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Usuarios
function UsuariosTab({ 
  users, 
  loading, 
  userRoleFilter, 
  setUserRoleFilter, 
  userSearch, 
  setUserSearch, 
  onSearch, 
  onUpdateRole 
}: {
  users: User[];
  loading: boolean;
  userRoleFilter: string;
  setUserRoleFilter: (filter: string) => void;
  userSearch: string;
  setUserSearch: (search: string) => void;
  onSearch: () => void;
  onUpdateRole: (userId: number, role: string) => void;
}) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'donador': return 'bg-green-100 text-green-800';
      case 'usuario': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Usuario
            </label>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Nombre o email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Rol
            </label>
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="donador">Donador</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={onSearch}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios ({users.length})</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.nombre.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.rol)}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={user.rol}
                        onChange={(e) => onUpdateRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="usuario">Usuario</option>
                        <option value="donador">Donador</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Blogs
function BlogsTab() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlog, setNewBlog] = useState({
    titulo: '',
    contenido: '',
    categoria: '',
    imagenUrl: ''
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5084/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        // Datos simulados
        setBlogs(mockBlogs);
      }
    } catch (error) {
      console.error('Error cargando blogs, usando datos simulados:', error);
      setBlogs(mockBlogs);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5084/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newBlog)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewBlog({ titulo: '', contenido: '', categoria: '', imagenUrl: '' });
        loadBlogs();
      }
    } catch (error) {
      console.error('Error creando blog:', error);
    }
  };

  // Datos simulados para blogs
  const mockBlogs = [
    {
      id: 1,
      titulo: 'La importancia de la lectura en la infancia',
      contenido: 'La lectura desde temprana edad desarrolla habilidades cognitivas...',
      categoria: 'Educación',
      imagenUrl: '/images/biblioteca.avif',
      fechaCreacion: '2024-03-15T10:30:00Z',
      autor: 'María González',
      likes: 24,
      comentarios: 8
    },
    {
      id: 2,
      titulo: 'Los mejores libros del mes',
      contenido: 'Este mes destacamos obras que han capturado la atención...',
      categoria: 'Recomendaciones',
      imagenUrl: '/images/biblioteca.avif',
      fechaCreacion: '2024-03-10T14:20:00Z',
      autor: 'Carlos Rodríguez',
      likes: 18,
      comentarios: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Blogs</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Crear Nuevo Blog
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Blog</h3>
          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newBlog.titulo}
                onChange={(e) => setNewBlog({...newBlog, titulo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={newBlog.categoria}
                onChange={(e) => setNewBlog({...newBlog, categoria: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="Educación">Educación</option>
                <option value="Recomendaciones">Recomendaciones</option>
                <option value="Eventos">Eventos</option>
                <option value="Noticias">Noticias</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={newBlog.imagenUrl}
                onChange={(e) => setNewBlog({...newBlog, imagenUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido
              </label>
              <textarea
                value={newBlog.contenido}
                onChange={(e) => setNewBlog({...newBlog, contenido: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Crear Blog
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Blogs Publicados ({blogs.length})</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={blog.imagenUrl || '/images/biblioteca.avif'}
                    alt={blog.titulo}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{blog.titulo}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Por {blog.autor} • {new Date(blog.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {blog.contenido}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-500">❤️ {blog.likes}</span>
                      <span className="text-sm text-gray-500">💬 {blog.comentarios}</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {blog.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Donaciones
function DonacionesTab() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    averageAmount: 0,
    thisMonth: 0
  });

  useEffect(() => {
    loadDonations();
    loadStats();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await fetch('http://localhost:5084/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      } else {
        // Datos simulados
        setDonations(mockDonations);
      }
    } catch (error) {
      console.error('Error cargando donaciones, usando datos simulados:', error);
      setDonations(mockDonations);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:5084/api/admin/donations/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Estadísticas simuladas
        setStats({
          totalDonations: 89,
          totalAmount: 15420.50,
          averageAmount: 173.26,
          thisMonth: 12
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas, usando datos simulados:', error);
      setStats({
        totalDonations: 89,
        totalAmount: 15420.50,
        averageAmount: 173.26,
        thisMonth: 12
      });
    }
  };

  // Datos simulados para donaciones
  const mockDonations = [
    {
      id: 1,
      monto: 50.00,
      fecha: '2024-03-29T10:30:00Z',
      causa: 'Biblioteca Comunitaria',
      estado: 'Completada',
      donador: 'María González',
      email: 'maria.gonzalez@email.com',
      mensaje: 'Gracias por su labor educativa'
    },
    {
      id: 2,
      monto: 25.00,
      fecha: '2024-03-28T14:20:00Z',
      causa: 'Programa de Lectura',
      estado: 'Completada',
      donador: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      mensaje: 'Apoyando la educación'
    },
    {
      id: 3,
      monto: 100.00,
      fecha: '2024-03-27T09:15:00Z',
      causa: 'Equipamiento',
      estado: 'Pendiente',
      donador: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      mensaje: 'Para nuevos libros'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">💝</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Donaciones
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalDonations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Recaudado
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats.totalAmount.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Promedio
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats.averageAmount.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Este Mes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.thisMonth}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Historial de Donaciones</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Causa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensaje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {donation.donador}
                        </div>
                        <div className="text-sm text-gray-500">
                          {donation.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${donation.monto.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.causa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        donation.estado === 'Completada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {donation.mensaje || 'Sin mensaje'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}