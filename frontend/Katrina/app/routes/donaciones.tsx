import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@remix-run/react';

interface DonationForm {
  donorName: string;
  donorEmail: string;
  comment: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  isAnonymous: boolean;
  bookId?: number;
}

export default function Donaciones() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DonationForm>({
    donorName: user?.nombre || '',
    donorEmail: user?.email || '',
    comment: '',
    amount: 0,
    currency: 'COP',
    paymentMethod: 'Transferencia',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5084/api/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          donorName: user?.nombre || '',
          donorEmail: user?.email || '',
          comment: '',
          amount: 0,
          currency: 'COP',
          paymentMethod: 'Transferencia',
          isAnonymous: false,
        });
      } else {
        alert('Error al procesar la donación. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💝 Apoya Nuestra Fundación
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu donación nos ayuda a continuar promoviendo la lectura y la educación 
            en nuestra comunidad. Cada contribución hace una diferencia real.
          </p>
        </div>

        {success ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Gracias por tu donación!
            </h3>
            <p className="text-gray-600 mb-6">
              Tu generosidad nos ayuda a continuar con nuestra misión de promover 
              la lectura y la educación. Recibirás una confirmación por email.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Hacer otra donación
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario de Donación */}
            <div className="bg-white shadow rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Realizar Donación
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del Donante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="donorEmail"
                    value={formData.donorEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto de la Donación *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      min="1"
                      step="1000"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="50000"
                    />
                  </div>
                </div>

                {/* Moneda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="COP">Peso Colombiano (COP)</option>
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>

                {/* Método de Pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="Digital">Pago Digital</option>
                  </select>
                </div>

                {/* Comentario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (Opcional)
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="¿Por qué decides hacer esta donación? (Opcional)"
                  />
                </div>

                {/* Donación Anónima */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Hacer donación anónima
                  </label>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Realizar Donación'
                  )}
                </button>
              </form>
            </div>

            {/* Información de la Fundación */}
            <div className="space-y-6">
              {/* Impacto */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Nuestro Impacto
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-xl">📚</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+1,000 Libros</p>
                      <p className="text-sm text-gray-600">Distribuidos en la comunidad</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-xl">👥</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+500 Niños</p>
                      <p className="text-sm text-gray-600">Beneficiados con programas de lectura</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-purple-600 text-xl">🏫</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">+20 Escuelas</p>
                      <p className="text-sm text-gray-600">Con bibliotecas implementadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cómo se usan las donaciones */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Cómo se usan las donaciones?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      <strong>60%</strong> - Adquisición de libros y material educativo
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      <strong>25%</strong> - Programas de promoción de lectura
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600">
                      <strong>15%</strong> - Gastos operativos y administrativos
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600">+57 300 123 4567</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">info@secretosparacontar.org</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">Medellín, Colombia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 