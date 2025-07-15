import React from 'react';

const libros = [
  { id: 1, titulo: "El Principito", imagen: "/images/principito.jpg" },
  { id: 2, titulo: "Autum", imagen: "/images/autum.png" },
  { id: 3, titulo: "El Gato con Botas", imagen: "/images/gato.jpg" },
  { id: 4, titulo: "Pedro el Gato de Pie", imagen: "/images/pedro.png" },
  { id: 5, titulo: "Los vertidos de mamá", imagen: "/images/vestidos.jpg" },
  { id: 6, titulo: "Harry Potter y la piedra filosofal", imagen: "/images/harry.jpg" },
];

export default function Biblioteca() {
  return (
    <section className="bg-[#F8F8F8] py-12 text-center">
      <h2 className="text-[#FA4616] text-2xl font-bold">Biblioteca</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6">
        {libros.map((libro) => (
          <div key={libro.id} className="bg-white p-6 shadow-md rounded-lg h-full flex flex-col justify-between">
            <img 
              src={libro.imagen} 
              alt={libro.titulo} 
              className="w-full h-56 object-contain bg-white p-2 rounded"
            />
            <p className="text-[#FA4616] font-bold mt-2 flex-grow">{libro.titulo}</p>
            <a href="#" className="text-blue-500 mt-2 block">Ver más...</a>
          </div>
        ))}
      </div>
    </section>
  );
}