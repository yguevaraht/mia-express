import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const Footer = ({ onAdminLogin }) => {
  return (
    <motion.footer
      className="w-full bg-gray-800 text-gray-400 py-6 px-4 flex flex-col md:flex-row items-center justify-between"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <p className="text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Mia Market & Food. Todos los derechos reservados.</p>
      <motion.button
        onClick={onAdminLogin}
        className="relative text-gray-600 hover:text-gray-400 transition-colors duration-200 flex items-center gap-2 p-2 rounded-full group" // Añade 'group' para el tooltip
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings className="w-5 h-5" />
        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Acceso BackOffice
        </span>
      </motion.button>
    </motion.footer>
  );
};

export default Footer;