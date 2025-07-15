// filepath: c:\secretosParaContar\frontend\Katrina\app\routes\nvedades.tsx
import React, { useState, useEffect } from "react";

const news = [
  {
    title: "¡Lorem Ipsum!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    image: "/images/0016_Chigorodo_0066_11zon.jpg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    image: "/images/DSC_0825_11zon.jpg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    image: "/images/IMG_6265_11zon.jpg",
    link: "#",
  },
];

const relatos = [
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/images/78e32ca2-cf92-4ddb-8e9c-19f40b59ea2b_11zon.jpg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/images/Galeria-SPC-11.webp",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/images/IMG_6265_11zon.jpg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    image: "/images/PROMOCION-DE-LECTURA-3.jpg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    image: "/images/WhatsApp-Image-2023-05-28-at-11.45.54-AM_11zon.jpeg",
    link: "#",
  },
  {
    title: "Lorem Ipsum",
    author: "Autor...",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    image: "/images/WhatsApp-Image-2023-07-26-at-2.55.55-PM-1_11zon.jpeg",
    link: "#",
  },
];

const NewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? news.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  };

  return (
    <>
      {/* Sección de Novedades */}
      <section className="bg-[#F8F9FA] py-12 px-4">
        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-3xl font-bold text-[#002847] mb-8 text-center">Novedades</h2>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {news.map((item, index) => (
                <div key={index} className="min-w-full flex-shrink-0 flex items-center gap-6 bg-white shadow-lg rounded-lg p-6">
                  <img src={item.image} alt={item.title} className="w-48 h-48 object-cover rounded-lg" />
                  <div className="max-w-lg">
                    <h3 className="font-bold text-lg text-[#002847] mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                    <a href={item.link} className="text-red-600 font-semibold mt-4 inline-block">Leer más &raquo;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Botones de navegación */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">❮</button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">❯</button>
        </div>
      </section>

      {/* Sección de Relatos Secreteros */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002847] mb-8 text-center">Relatos Secreteros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatos.map((relato, index) => (
              <div key={index} className="bg-[#F8F9FA] p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src={relato.image} alt={relato.title} className="w-full h-48 object-cover rounded-lg" />
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-[#002847]">{relato.title}</h3>
                  <p className="text-red-600 font-semibold">Escrito por {relato.author}</p>
                  <p className="text-gray-700 text-sm mt-2">{relato.description}</p>
                  <a href={relato.link} className="text-red-600 font-semibold mt-4 inline-block">Leer más &raquo;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsCarousel;