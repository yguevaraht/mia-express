import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Percent, Star, Award, Leaf, Heart } from 'lucide-react';

const benefits = [
  {
    icon: Gift,
    title: "Regalos Exclusivos",
    description: "Sorpresas y obsequios especiales en tu cumpleaños y fechas importantes."
  },
  {
    icon: Percent,
    title: "Descuentos VIP",
    description: "Acceso a ofertas y promociones únicas solo para miembros del club."
  },
  {
    icon: Star,
    title: "Puntos por Compras",
    description: "Acumula puntos en cada compra y canjéalos por productos o descuentos."
  },
  {
    icon: Award,
    title: "Eventos Privados",
    description: "Invitaciones a degustaciones, talleres y lanzamientos exclusivos."
  },
  {
    icon: Leaf,
    title: "Productos Frescos",
    description: "Prioridad en la compra de productos de temporada y orgánicos."
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    description: "Soporte y asesoramiento dedicado para todas tus necesidades."
  }
];

const BenefitsSection = () => {
  return (
    <motion.section
      className="py-12 px-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
        Beneficios de Ser Miembro
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"> 
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-4 sm:p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ translateY: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
          >
            <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-3 sm:mb-4">
              <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-0 sm:mb-2">{benefit.title}</h3>
            {/* La descripción se oculta en pantallas pequeñas (sm:hidden) y se muestra en pantallas medianas y grandes (md:block) */}
            <p className="hidden md:block text-xs sm:text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BenefitsSection;