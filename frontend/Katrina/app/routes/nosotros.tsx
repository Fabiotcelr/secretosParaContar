// filepath: c:\secretosParaContar\frontend\Katrina\app\routes\nosotros.tsx
import React from "react";

const Nosotros = () => {
  return (
    <section className="bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#002847] mb-6">Nuestra historia</h2>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col lg:flex-row gap-6">
          {/* Texto descriptivo */}
          <div className="flex-1">
            <p className="text-gray-700 italic text-lg">
              La población rural colombiana, guardiana de los bosques y las selvas, las aguas y los
              animales, habita lejos de los centros de desarrollo urbano. Para llegar hasta sus hogares es
              necesario apartarse de las vías principales, seguir el curso de los ríos y remontar las cimas
              de las montañas.
            </p>
            <p className="mt-4 text-gray-800">
              <span className="text-[#D72638] font-semibold">¿Sabes qué leen las familias del campo?</span> 
              <span className="text-[#D72638] font-semibold"> ¿Sabes si tienen libros?</span>
              <span className="text-[#D72638] font-semibold"> ¿Sabes cómo estudian los niños campesinos?</span>
              <span className="text-[#D72638] font-semibold"> ¿Cómo se capacitan los docentes rurales?</span>
              <br />
              La <span className="font-semibold">Fundación Secretos para contar</span> nació en el año 2004 a partir de estas preguntas.
            </p>
            <p className="mt-4 text-gray-800">
              Decidimos entonces crear un <span className="font-semibold">proyecto educativo</span> que pensara, escribiera y diseñara estrategias, contenidos y
              talleres de capacitación que atendieran a las necesidades e intereses de los habitantes del campo y
              les aportaran en su desarrollo individual y colectivo.
            </p>
          </div>
          {/* Video */}
          <div className="flex-1">
            <iframe
              className="w-full h-60 lg:h-72 rounded-lg"
              src="https://www.youtube.com/embed/DxuFCW4UdEw"
              title="Fundación Secretos para Contar"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Sección de Informes de Gestión */}
      <div className="bg-gray-100 py-12 mt-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#002847]">Informes de gestión</h2>
          <p className="mt-2 text-gray-700">
            Nuestro trabajo es posible gracias a la dedicación, pasión y entrega de nuestro personal, a la buena acogida y apertura de las comunidades y a las distintas acciones que nos apoyan en la promoción de la lectura, educación y entretenimiento en la lectura infantil del campo.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-8">
          <h3 className="text-lg font-semibold text-[#002847] text-center">
            Cifras de gestión destacadas - 20 años
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {[
              { cantidad: "8.014.628", descripcion: "Material entregado a familias, estudiantes y maestros rurales" },
              { cantidad: "8.891", descripcion: "Días en promociones de lectura" },
              { cantidad: "306.000", descripcion: "Familias beneficiadas fuera de Antioquia con colecciones de promoción de lectura" },
              { cantidad: "213.000", descripcion: "Familias beneficiadas en Antioquia con 8 colecciones del programa de promoción de lectura" },
              { cantidad: "3.437", descripcion: "Talleres pedagógicos de promoción de lectura realizados con maestros" },
              { cantidad: "22.390", descripcion: "Promociones de lectura realizadas con familias y maestros" }
            ].map((item, index) => (
              <div key={index} className="bg-[#ECEAD3] p-6 rounded-lg shadow-md text-center">
                <p className="text-[#FA4616] text-2xl font-bold">{item.cantidad}</p>
                <p className="text-[#002847] text-sm">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nosotros;

