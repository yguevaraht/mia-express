import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Tag, Calendar, Home, LogOut } from 'lucide-react';

// SVG del logo de Mia Market & Food (duplicado para Navbar, idealmente se importaría de un archivo común)
const MiaLogoSVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 0C22.386 0 0 22.386 0 50s22.386 50 50 50 50-22.386 50-50S77.614 0 50 0zm0 10c22.091 0 40 17.909 40 40s-17.909 40-40 40-40-17.909-40-40 17.909-40 40-40z"
      fill="url(#paint0_linear_1_2_nav)"
    />
    <path
      d="M50 25c-5.523 0-10 4.477-10 10v30c0 5.523 4.477 10 10 10s10-4.477 10-10V35c0-5.523-4.477-10-10-10z"
      fill="url(#paint1_linear_1_2_nav)"
    />
    <path
      d="M30 45c0-2.761 2.239-5 5-5h30c2.761 0 5 2.239 5 5v10c0 2.761-2.239 5-5 5H35c-2.761 0-5-2.239-5-5V45z"
      fill="url(#paint2_linear_1_2_nav)"
    />
    <defs>
      <linearGradient id="paint0_linear_1_2_nav" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF8C00"/>
        <stop offset="1" stopColor="#FF4500"/>
      </linearGradient>
      <linearGradient id="paint1_linear_1_2_nav" x1="50" y1="25" x2="50" y2="75" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700"/>
        <stop offset="1" stopColor="#FFA500"/>
      </linearGradient>
      <linearGradient id="paint2_linear_1_2_nav" x1="50" y1="40" x2="50" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6347"/>
        <stop offset="1" stopColor="#FF0000"/>
      </linearGradient>
    </defs>
  </svg>
);


const Navbar = ({ onNavigate, onEditProfile, onLogout, userName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Inicio", icon: Home, path: "home" },
    { name: "Ofertas", icon: Tag, path: "offers" },
    { name: "Eventos", icon: Calendar, path: "events" },
  ];

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsOpen(false); // Cierra el menú al navegar
  };

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-xl shadow-lg rounded-full px-6 py-3 fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between w-[calc(100%-2rem)] max-w-4xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
    >
      <div className="flex items-center">
        <div className="h-8 w-8 mr-3">
          <MiaLogoSVG /> {/* Usa el componente SVG */}
        </div>
        <span className="text-lg font-bold text-gray-800 hidden md:block">Mia Club</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </motion.button>
        ))}
        <motion.button
          onClick={onEditProfile}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-5 h-5" />
          {userName || 'Mi Perfil'} {/* Muestra el nombre del usuario */}
        </motion.button>
        <motion.button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5" />
          Salir
        </motion.button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} // Cierra al hacer clic fuera
          >
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col space-y-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={(e) => e.stopPropagation()} // Evita que el clic en el menú cierre el overlay
            >
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-600 font-semibold text-lg py-2"
                  whileHover={{ x: 5 }}
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </motion.button>
              ))}
              <motion.button
                onClick={onEditProfile}
                className="flex items-center gap-3 text-gray-700 hover:text-orange-600 font-semibold text-lg py-2"
                whileHover={{ x: 5 }}
              >
                <User className="w-6 h-6" />
                {userName || 'Mi Perfil'}
              </motion.button>
              <motion.button
                onClick={onLogout}
                className="flex items-center gap-3 text-gray-700 hover:text-red-600 font-semibold text-lg py-2"
                whileHover={{ x: 5 }}
              >
                <LogOut className="w-6 h-6" />
                Salir
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;