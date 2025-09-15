import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const Header = ({ onNavigateToLogin, onNavigateToRegister, isLoggedIn, userProfile, onLogout, onGoToHome, webConfig }) => {
  const [logoConfig, setLogoConfig] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [logoError, setLogoError] = useState(null);

  useEffect(() => {
    // Si webConfig ya tiene el logo, úsalo directamente
    if (webConfig && webConfig.logo && webConfig.logo.url) {
      setLogoConfig(webConfig.logo);
      setLoadingLogo(false);
    } else {
      // Si no, intenta cargarlo de la base de datos (aunque App.js ya lo hace)
      const fetchLogoConfig = async () => {
        setLoadingLogo(true);
        const { data, error } = await supabase
          .from('web_config')
          .select('config_value')
          .eq('config_name', 'logo')
          .single();

        if (error) {
          console.error('Error fetching logo config:', error);
          setLogoError('Error al cargar el logo.');
        } else {
          setLogoConfig(data ? data.config_value : null);
        }
        setLoadingLogo(false);
      };
      fetchLogoConfig();
    }
  }, [webConfig]); // Dependencia de webConfig

  return (
    <motion.header
      className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 py-4 px-6 flex items-center justify-between"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <div className="flex items-center">
        <motion.button
          onClick={onGoToHome}
          className="flex items-center focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loadingLogo ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          ) : logoConfig && logoConfig.url ? (
            <img src={logoConfig.url} alt={logoConfig.alt_text || "Mia Market Logo"} className="h-10 mr-3" />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">{webConfig.site_title || "Mia Market"}</h1>
          )}
        </motion.button>
      </div>

      <nav className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <motion.button
              className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
              style={{ '--tw-text-opacity': 1, color: `var(--primary-color)` }} // Ejemplo de uso de color
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserCircle className="w-6 h-6 mr-1" />
              <span className="font-medium hidden md:block">{userProfile.firstName || userProfile.email}</span>
            </motion.button>
            <motion.button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
              style={{ backgroundColor: `var(--primary-color)` }} // Ejemplo de uso de color
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar Sesión
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              onClick={onNavigateToLogin}
              className="text-gray-700 hover:text-orange-500 transition-colors px-4 py-2 rounded-full font-medium"
              style={{ '--tw-text-opacity': 1, color: `var(--primary-color)` }} // Ejemplo de uso de color
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Iniciar Sesión
            </motion.button>
            <motion.button
              onClick={onNavigateToRegister}
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
              style={{ backgroundColor: `var(--primary-color)` }} // Ejemplo de uso de color
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Registrarse
            </motion.button>
          </>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;