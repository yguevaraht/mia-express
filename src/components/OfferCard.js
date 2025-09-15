import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Calendar, ShoppingCart, Sparkles } from 'lucide-react'; 

const OfferCard = ({ offer, index }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'descuento':
        return <Tag className="w-5 h-5 text-white" />;
      case 'evento':
        return <Calendar className="w-5 h-5 text-white" />;
      case 'novedad':
        return <Sparkles className="w-5 h-5 text-white" />;
      default:
        return <ShoppingCart className="w-5 h-5 text-white" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'descuento':
        return 'from-green-400 to-emerald-500';
      case 'evento':
        return 'from-blue-400 to-indigo-500';
      case 'novedad':
        return 'from-purple-400 to-pink-500';
      default:
        return 'from-orange-400 to-red-500';
    }
  };

  // La función generateWhatsAppLink ya no es necesaria si el enlace es fijo
  // const generateWhatsAppLink = (offerTitle) => {
  //   const phoneNumber = '51987654321'; // Reemplaza con tu número de WhatsApp
  //   const message = `¡Hola! Estoy interesado/a en la oferta: "${offerTitle}". ¿Podrías darme más información?`;
  //   return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  // };

  const beaconsAiLink = "https://beacons.ai/miamarketfood"; // Enlace fijo

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${getBgColor(offer.type)}`}>
          {offer.type}
        </div>
        <div className={`absolute bottom-3 right-3 p-2 rounded-full bg-gradient-to-br ${getBgColor(offer.type)}`}>
          {getIcon(offer.type)}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
        {/* Descripción visible solo en desktop */}
        <p className="hidden md:block text-gray-600 text-sm mb-4 line-clamp-3">{offer.description}</p>
        <div className="flex items-center justify-between">
          {offer.price !== undefined && offer.price !== null && ( // Verifica que el precio exista
            <span className="text-2xl font-extrabold text-orange-600">
              S/{offer.price.toFixed(2)} {/* Formatea a Soles con 2 decimales */}
            </span>
          )}
          {offer.originalPrice !== undefined && offer.originalPrice !== null && ( // Verifica que el precio original exista
            <span className="text-sm text-gray-400 line-through ml-2">
              S/{offer.originalPrice.toFixed(2)} {/* Formatea a Soles con 2 decimales */}
            </span>
          )}
          {offer.date && (
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> {offer.date}
            </span>
          )}
          <motion.a
            href={beaconsAiLink} // Enlace fijo a Beacons.ai
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-full font-semibold text-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pedir
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default OfferCard;