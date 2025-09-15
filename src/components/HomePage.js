import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Sparkles, Users, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabase';

const HomePage = ({ onNavigateToRegister, onNavigateToLogin, onAdminLogin, webConfig }) => {
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoadingBanners(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching banners:', error);
        setBannerError('Error al cargar los banners: ' + error.message);
      } else {
        setBanners(data || []);
      }
      setLoadingBanners(false);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          (prevIndex + 1) % banners.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Banners Principales */}
      {loadingBanners ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-8"
        >
          Cargando banners...
        </motion.div>
      ) : bannerError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 mb-8"
        >
          {bannerError}
        </motion.div>
      ) : banners.length > 0 ? (
        <motion.div
          className="w-full max-w-4xl mb-12 overflow-hidden rounded-3xl shadow-xl relative"
          style={{ height: '400px', y }}
        >
          <AnimatePresence initial={false} mode="wait">
            {banners.map((banner, index) => (
              index === currentBannerIndex && (
                <motion.div
                  key={banner.id}
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center flex items-center justify-center text-white"
                  style={{ backgroundImage: `url(${banner.image_url})` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-2 text-shadow-lg">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl mb-4 text-shadow-md">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.link_url && (
                      <motion.a
                        href={banner.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                        style={{ backgroundColor: `var(--primary-color)` }} // Ejemplo de uso de color
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Ver Más
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-8"
        >
          No hay banners activos en este momento.
        </motion.div>
      )}

      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Bienvenido al <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--primary-color), var(--secondary-color))` }}>{webConfig.site_title || "Mia Club"}</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        Descubre un mundo de beneficios exclusivos, ofertas irresistibles y eventos especiales
        diseñados solo para ti. ¡Únete a nuestra comunidad y empieza a disfrutar!
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <motion.button
          onClick={onNavigateToRegister}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          style={{ backgroundImage: `linear-gradient(to right, var(--primary-color), var(--secondary-color))` }} // Ejemplo de uso de color
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Únete al Club Ahora <ArrowRight className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={onNavigateToLogin}
          className="bg-white text-orange-600 border border-orange-500 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-3"
          style={{ color: `var(--primary-color)`, borderColor: `var(--primary-color)`, '--tw-bg-opacity': 1, backgroundColor: `rgba(var(--primary-color-rgb), 0.05)` }} // Ejemplo de uso de color
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ya soy Miembro <Users className="w-5 h-5" />
        </motion.button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md flex flex-col items-center"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
        >
          <ShoppingBag className="w-12 h-12 text-orange-500 mb-4" style={{ color: `var(--primary-color)` }} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ofertas Exclusivas</h3>
          <p className="text-gray-600 text-center">Accede a descuentos y promociones solo para miembros.</p>
        </motion.div>
        <motion.div
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md flex flex-col items-center"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
        >
          <Sparkles className="w-12 h-12 text-red-500 mb-4" style={{ color: `var(--secondary-color)` }} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Eventos VIP</h3>
          <p className="text-gray-600 text-center">Participa en degustaciones y talleres únicos.</p>
        </motion.div>
        <motion.div
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md flex flex-col items-center"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
        >
          <Users className="w-12 h-12 text-purple-500 mb-4" style={{ color: `var(--primary-color)` }} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Comunidad</h3>
          <p className="text-gray-600 text-center">Conéctate con otros amantes de la buena comida.</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;