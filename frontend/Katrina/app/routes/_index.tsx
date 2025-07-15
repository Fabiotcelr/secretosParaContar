export default function HomePage() {
  return (
    <div className="w-full">
      {/* Banner de bienvenida */}
      <header className="relative w-full h-[400px] bg-cover bg-center flex flex-col items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/images/biblioteca.avif')" }}>
        
        {/* Capa de superposición */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Contenido del banner */}
        <div className="relative z-10 px-6">
          <h1 className="text-3xl font-bold">Bienvenidos a Secretos para Contar</h1>
          <p className="text-lg mt-2">Explora un mundo de conocimiento con nuestra biblioteca.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-[#FA4616] hover:bg-red-800 text-white px-6 py-2 rounded">Donar ahora</button>
            <button className="bg-white text-[#FA4616] px-6 py-2 rounded border border-[#FA4616]">Explorar Biblioteca</button>
          </div>
        </div>

        {/* Forma ondulada en la parte inferior */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path fill="#FA4616" fillOpacity="1" d="M0,256L80,234.7C160,213,320,171,480,176C640,181,800,235,960,229.3C1120,224,1280,160,1360,128L1440,96V320H0Z"></path>
          </svg>
        </div>
      </header>

      {/* Sección "Secretos para contar" */}
      <section className="bg-[#F8F8F8] py-12 px-6 text-center">
        <h2 className="text-[#FA4616] text-2xl font-bold">Secretos para contar</h2>
        <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto mt-6">
          <img 
            src="/images/leen.jpg" 
            alt="Niños leyendo" 
            className="w-full md:w-1/2 rounded-lg shadow-md"
          />
          <p className="text-gray-700 text-justify md:w-1/2 md:ml-6">
            La población rural colombiana, guardiana de los bosques y las selvas, las aguas y los animales, 
            habita lejos de los centros de desarrollo urbano. Para llegar hasta sus hogares es necesario 
            apartarse de las vías principales, seguir el curso de los ríos y remontar las cimas de las montañas.
          </p>
        </div>
      </section>

      {/* Sección "Destacados" */}
      <section className="bg-[#F8F8F8] py-12 text-center">
        <h2 className="text-[#FA4616] text-2xl font-bold">Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6">
          {[
            {
              id: 1,
              titulo: "Un beso de mandarina",
              imagen: "/images/beso.jpg",
            },
            {
              id: 2,
              titulo: "Charlie y la fábrica de chocolate",
              imagen: "/images/charlie.jpg",
            },
            {
              id: 3,
              titulo: "El lago secreto",
              imagen: "/images/lago.jpg",
            },
          ].map((libro) => (
            <div key={libro.id} className="bg-white p-8 shadow-md rounded-lg">
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="w-full h-46 object-cover rounded"
              />
              <p className="text-[#FA4616] font-bold mt-2">{libro.titulo}</p>
              <a href="#" className="text-blue-500 mt-2 block">Ver más...</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
