import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OfferCard from './OfferCard';
import Navbar from './Navbar';
import ProfileModal from './ProfileModal';
import { Sparkles, Tag, Calendar, User, Search, Filter, DollarSign } from 'lucide-react';

const dummyOffers = [
  {
    id: 1,
    title: "20% de Descuento en Frutas Frescas",
    description: "Disfruta de un 20% de descuento en todas las frutas de temporada. ¡Frescura garantizada para tu mesa!",
    image: "https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0g2GpY7ByGbrS9nEWZQlfP5u0qJcMdT1UxIvR",
    type: "descuento",
    category: "Alimentos",
    price: 8.50, // Precio numérico
    originalPrice: 10.62
  },
  {
    id: 2,
    title: "Noche de Degustación de Quesos Artesanales",
    description: "Únete a nuestra exclusiva noche de degustación. Prueba los mejores quesos artesanales maridados con vinos selectos.",
    image: "https://images.unsplash.com/photo-1586201375761-8386500d392d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "evento",
    category: "Eventos",
    date: "25/03/2025",
    price: 35.00 // Precio numérico para eventos
  },
  {
    id: 3,
    title: "Nuevos Productos Orgánicos en Tienda",
    description: "Descubre nuestra nueva línea de productos orgánicos certificados. ¡Alimenta tu cuerpo de forma natural!",
    image: "https://images.unsplash.com/photo-1542838132-92570297319a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "novedad",
    category: "Alimentos",
    price: 12.75
  },
  {
    id: 4,
    title: "30% en Carnes Premium",
    description: "Oferta especial en cortes de carne premium. ¡Perfecto para tu próxima parrillada!",
    image: "https://images.unsplash.com/photo-1628272949891-30700b2c7541?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "descuento",
    category: "Alimentos",
    price: 25.99,
    originalPrice: 37.13
  },
  {
    id: 5,
    title: "Clase de Cocina Saludable con Chef Invitado",
    description: "Aprende a preparar platos deliciosos y nutritivos con nuestro chef invitado. ¡Cupos limitados!",
    image: "https://images.unsplash.com/photo-1576595580341-f3e35629517e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "evento",
    category: "Eventos",
    date: "10/04/2025",
    price: 50.00
  },
  {
    id: 6,
    title: "Lanzamiento: Panadería Artesanal",
    description: "Descubre el sabor auténtico de nuestro pan recién horneado, hecho con masa madre y los mejores ingredientes.",
    image: "https://images.unsplash.com/photo-1583339752135-c77290770667?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "novedad",
    category: "Alimentos",
    price: 6.25
  },
  {
    id: 7,
    title: "Descuento en Productos de Limpieza Ecológicos",
    description: "Cuida tu hogar y el planeta con un 15% de descuento en nuestra línea de limpieza ecológica.",
    image: "https://images.unsplash.com/photo-1581578731548-adab68c07897?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "descuento",
    category: "Hogar",
    price: 15.00,
    originalPrice: 17.65
  },
  {
    id: 8,
    title: "Taller de Huertos Urbanos",
    description: "Aprende a cultivar tus propias verduras en casa. ¡Un evento para toda la familia!",
    image: "https://images.unsplash.com/photo-1533035353720-f1c6a7b759d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "evento",
    category: "Eventos",
    date: "05/05/2025",
    price: 20.00
  },
  {
    id: 9,
    title: "Café Orgánico de Origen Único",
    description: "Disfruta de nuestro nuevo café orgánico, cultivado en las montañas de Colombia. Aroma y sabor inigualables.",
    image: "https://images.unsplash.com/photo-1511920170104-dr286c4408f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "novedad",
    category: "Bebidas",
    price: 9.99
  },
  {
    id: 10,
    title: "Cesta de Productos Gourmet",
    description: "Una selección de los mejores productos gourmet para regalar o disfrutar en casa. Edición limitada.",
    image: "https://images.unsplash.com/photo-1550989460-0adf9bb60d13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "descuento",
    category: "Regalos",
    price: 75.00,
    originalPrice: 90.00
  }
];

const OffersPage = ({ userProfile, onSaveProfile, onLogout }) => {
  const [activeSection, setActiveSection] = useState('offers');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all'); // Nuevo estado para el filtro de precio

  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const filteredOffers = dummyOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || offer.category === filterCategory;
    // Asegúrate de que la lógica de filtrado por sección sea correcta
    const matchesSection = activeSection === 'offers' ? offer.type !== 'evento' : offer.type === 'evento';
    
    // Lógica de filtrado por precio
    const matchesPrice = () => {
      if (filterPrice === 'all') return true;
      if (offer.price === undefined || offer.price === null) return false; // Si no tiene precio, no coincide con filtros de precio

      const price = offer.price;
      switch (filterPrice) {
        case 'less-10':
          return price < 10;
        case '10-50':
          return price >= 10 && price <= 50;
        case 'more-50':
          return price > 50;
        default:
          return true;
      }
    };
    
    return matchesSearch && matchesCategory && matchesSection && matchesPrice();
  });

  const categories = ['all', ...new Set(dummyOffers.map(offer => offer.category))];
  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: 'less-10', label: 'Menos de S/10' },
    { value: '10-50', label: 'S/10 - S/50' },
    { value: 'more-50', label: 'Más de S/50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Navbar 
        onNavigate={setActiveSection} 
        onEditProfile={handleEditProfile} 
        onLogout={onLogout}
        userName={userProfile.firstName}
      />

      <motion.div
        className="pt-24 pb-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            ¡Bienvenido al Club de Ofertas!
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Aquí encontrarás las mejores ofertas, descuentos exclusivos y eventos especiales
            pensados solo para ti, miembro VIP de Mia Market & Food.
          </p>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          className="max-w-4xl mx-auto mb-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar ofertas o eventos..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {/* Nuevo filtro de precio */}
          <div className="relative w-full md:w-auto">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 bg-white"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </motion.div>

        {activeSection === 'offers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer, index) => (
                <OfferCard key={offer.id} offer={offer} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="col-span-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Vaya! No encontramos ofertas.</h2>
                <p className="text-gray-600">Intenta ajustar tu búsqueda o filtros.</p>
              </motion.div>
            )}
          </div>
        )}

        {activeSection === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Próximos Eventos Exclusivos</h2>
            <p className="text-gray-600 mb-6">
              ¡Prepárate para experiencias únicas! Aquí te mantendremos al tanto de nuestras
              degustaciones, clases de cocina y eventos especiales solo para miembros del club.
            </p>
            <div className="space-y-4">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Calendar className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      <p className="text-blue-500 text-xs font-medium mt-1">Fecha: {event.date}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No hay eventos próximos que coincidan con tu búsqueda. ¡Mantente atento!</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Sección de "Mi Perfil" (vacía, se gestiona con el modal) */}
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mi Perfil</h2>
            <p className="text-gray-600 mb-6">
              Aquí puedes ver y editar tu información personal.
            </p>
            <User className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-lg">Haz clic en "Mi Perfil" en el menú para editar tus datos.</p>
          </motion.div>
        )}


        <motion.div 
          className="text-center mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="hidden md:block">© 2025 Mia Market & Food. Todos los derechos reservados.</p>
          <p className="hidden md:block mt-2">¿Preguntas? Contáctanos: club@miamarket.com</p>
        </motion.div>
      </motion.div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        userData={userProfile}
        onSaveProfile={onSaveProfile}
      />
    </div>
  );
};

export default OffersPage;