import { Link } from "@remix-run/react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Aquí se implementaría la lógica de suscripción
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#B8D9F0] text-[#002847]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y Descripción */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-start space-y-4">
              <img src="/images/logoSpc.png" alt="Secretos para Contar" className="w-40 h-auto" />
                             <p className="text-gray-600 text-sm leading-relaxed">
                 Promovemos la lectura y la educación en Colombia, 
                 creando oportunidades para que niños y jóvenes 
                 descubran el poder transformador de los libros.
               </p>
              
              {/* Redes Sociales */}
                             <div className="flex space-x-4 pt-2">
                 <a 
                   href="https://www.instagram.com/secretosparacontar/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-[#E8F4FD]/80 hover:bg-[#D1E7F7] p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                   aria-label="Instagram"
                 >
                   <img src="/images/instagram.png" alt="Instagram" className="w-5 h-5" />
                 </a>
                 <a 
                   href="https://www.facebook.com/secretosparacontar" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-[#E8F4FD]/80 hover:bg-[#D1E7F7] p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                   aria-label="Facebook"
                 >
                   <img src="/images/facebook.png" alt="Facebook" className="w-5 h-5" />
                 </a>
                 <a 
                   href="https://www.linkedin.com/company/fundacionsecretosparacontar/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-[#E8F4FD]/80 hover:bg-[#D1E7F7] p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                   aria-label="LinkedIn"
                 >
                   <img src="/images/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                 </a>
                 <a 
                   href="https://www.youtube.com/user/fundasecretos" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-[#E8F4FD]/80 hover:bg-[#D1E7F7] p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                   aria-label="YouTube"
                 >
                   <img src="/images/youtube.png" alt="YouTube" className="w-5 h-5" />
                 </a>
                 <a 
                   href="https://x.com/Secretoscontar" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-[#E8F4FD]/80 hover:bg-[#D1E7F7] p-2 rounded-full transition-all duration-300 transform hover:scale-110"
                   aria-label="Twitter"
                 >
                   <img src="/images/twitter-x.svg" alt="Twitter" className="w-5 h-5" />
                 </a>
               </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#002847]">Enlaces Rápidos</h3>
                         <ul className="space-y-3">
               <li>
                 <Link 
                   to="/" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Inicio
                 </Link>
               </li>
               <li>
                 <Link 
                   to="/biblioteca" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Biblioteca
                 </Link>
               </li>
               <li>
                 <Link 
                   to="/novedades" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Novedades
                 </Link>
               </li>
               <li>
                 <Link 
                   to="/nosotros" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Nosotros
                 </Link>
               </li>
               <li>
                 <Link 
                   to="/donaciones" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Donaciones
                 </Link>
               </li>
             </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#002847]">Recursos</h3>
                         <ul className="space-y-3">
               <li>
                 <a 
                   href="#" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Guías de Lectura
                 </a>
               </li>
               <li>
                 <a 
                   href="#" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Programas Educativos
                 </a>
               </li>
               <li>
                 <a 
                   href="#" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Reportes de Impacto
                 </a>
               </li>
               <li>
                 <a 
                   href="#" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Material Didáctico
                 </a>
               </li>
               <li>
                 <a 
                   href="#" 
                   className="text-gray-700 hover:text-[#FA4616] transition-colors duration-200"
                 >
                   Voluntariado
                 </a>
               </li>
             </ul>
          </div>

          {/* Contacto y Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#002847]">Mantente Conectado</h3>
            
            {/* Newsletter */}
            <div className="mb-6">
                             <p className="text-gray-600 text-sm mb-3">
                 Suscríbete para recibir nuestras novedades
               </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Tu correo electrónico"
                   className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FA4616]/50 focus:border-[#FA4616]"
                   required
                 />
                <button
                  type="submit"
                  className="w-full bg-[#FA4616] hover:bg-[#e03d12] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Suscribirse
                </button>
              </form>
              {isSubscribed && (
                <p className="text-green-400 text-sm mt-2">¡Gracias por suscribirte!</p>
              )}
            </div>

            {/* Información de Contacto */}
                         <div className="space-y-2">
               <div className="flex items-center text-gray-600 text-sm">
                 <span>Medellín, Colombia</span>
               </div>
               <div className="flex items-center text-gray-600 text-sm">
                 <a href="mailto:info@secretosparacontar.org" className="hover:text-[#FA4616] transition-colors">
                   info@secretosparacontar.org
                 </a>
               </div>
               <div className="flex items-center text-gray-600 text-sm">
                 <a href="tel:+573001234567" className="hover:text-[#FA4616] transition-colors">
                   +57 300 123 4567
                 </a>
               </div>
             </div>
          </div>
        </div>
      </div>

             {/* Bottom Footer */}
       <div className="border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                         <div className="text-gray-600 text-sm">
               © 2024 Fundación Secretos para Contar. Todos los derechos reservados.
             </div>
            
                         <div className="flex flex-wrap justify-center space-x-6 text-sm">
               <a 
                 href="#" 
                 className="text-gray-600 hover:text-[#FA4616] transition-colors duration-200"
               >
                 Términos y Condiciones
               </a>
               <a 
                 href="#" 
                 className="text-gray-600 hover:text-[#FA4616] transition-colors duration-200"
               >
                 Política de Privacidad
               </a>
               <a 
                 href="#" 
                 className="text-gray-600 hover:text-[#FA4616] transition-colors duration-200"
               >
                 Política de Cookies
               </a>
               <a 
                 href="#" 
                 className="text-gray-600 hover:text-[#FA4616] transition-colors duration-200"
               >
                 Mapa del Sitio
               </a>
             </div>
          </div>
        </div>
      </div>
      
      {/* Orange line at the very bottom */}
      <div className="h-1 bg-[#FA4616]"></div>
    </footer>
  );
};

export default Footer;

  