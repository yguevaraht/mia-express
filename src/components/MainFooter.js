import React from 'react';
import { motion } from 'framer-motion';

const MainFooter = () => {
  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 to-gray-700 text-gray-200 py-8 md:py-12 mt-auto relative overflow-hidden w-full flex items-center justify-center" // Centra el contenido
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Elementos decorativos de fondo - Eliminados */}
      {/* Contenido de las columnas - Eliminado */}

      <div className="text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Mia Market & Food. Todos los derechos reservados.</p>
      </div>
    </motion.footer>
  );
};

export default MainFooter;