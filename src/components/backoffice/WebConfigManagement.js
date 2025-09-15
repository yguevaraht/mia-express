import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, CheckCircle, Upload, Image as ImageIcon, Palette, Type } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const WebConfigManagement = () => {
  const [config, setConfig] = useState({
    primary_color: '#FF5722', // Naranja
    secondary_color: '#FFC107', // Ámbar
    logo: { url: '', alt_text: '' },
    site_title: 'Mia Club',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const RECOMMENDED_LOGO_DIMENSIONS = "200x60px (relación de aspecto 10:3)";

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('web_config')
      .select('*');

    if (error) {
      console.error('Error fetching web config:', error);
      setError('Error al cargar la configuración: ' + error.message);
    } else {
      const fetchedConfig = {};
      data.forEach(item => {
        fetchedConfig[item.config_name] = item.config_value;
      });
      setConfig(prevConfig => ({
        ...prevConfig,
        ...fetchedConfig,
        logo: fetchedConfig.logo || { url: '', alt_text: '' },
      }));
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'logo_url') {
      setConfig(prevConfig => ({
        ...prevConfig,
        logo: { ...prevConfig.logo, url: value }
      }));
    } else if (name === 'logo_alt_text') {
      setConfig(prevConfig => ({
        ...prevConfig,
        logo: { ...prevConfig.logo, alt_text: value }
      }));
    } else {
      setConfig(prevConfig => ({ ...prevConfig, [name]: value }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const filePath = `public/logo/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('mia-club-images') // Asegúrate de que este bucket exista en Supabase Storage
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading logo:', error);
      setMessage({ type: 'error', text: 'Error al subir el logo: ' + error.message });
    } else {
      const publicURL = supabase.storage.from('mia-club-images').getPublicUrl(filePath).data.publicUrl;
      setConfig(prevConfig => ({
        ...prevConfig,
        logo: { ...prevConfig.logo, url: publicURL }
      }));
      setMessage({ type: 'success', text: 'Logo subido con éxito.' });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const updates = Object.keys(config).map(key => ({
      config_name: key,
      config_value: config[key],
    }));

    const { error } = await supabase
      .from('web_config')
      .upsert(updates, { onConflict: 'config_name' });

    if (error) {
      console.error('Error updating web config:', error);
      setMessage({ type: 'error', text: 'Error al actualizar la configuración: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Configuración actualizada con éxito.' });
      // Dispara un evento personalizado para que App.js recargue la configuración
      window.dispatchEvent(new CustomEvent('webConfigUpdated'));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Cargando configuración...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Configuración Web</h2>

      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ajustes Generales</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título del Sitio */}
          <div>
            <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-2">
              Título del Sitio
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                id="site_title"
                name="site_title"
                value={config.site_title}
                onChange={handleInputChange}
                className="pl-10 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Color Primario */}
          <div>
            <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="primary_color"
                name="primary_color"
                value={config.primary_color}
                onChange={handleInputChange}
                className="w-12 h-12 rounded-lg border-none cursor-pointer"
              />
              <input
                type="text"
                value={config.primary_color}
                onChange={handleInputChange}
                name="primary_color"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="secondary_color"
                name="secondary_color"
                value={config.secondary_color}
                onChange={handleInputChange}
                className="w-12 h-12 rounded-lg border-none cursor-pointer"
              />
              <input
                type="text"
                value={config.secondary_color}
                onChange={handleInputChange}
                name="secondary_color"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="md:col-span-2">
            <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Logo del Sitio ({RECOMMENDED_LOGO_DIMENSIONS})
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
                disabled={uploading}
              />
              {uploading && (
                <svg className="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            {config.logo.url && (
              <div className="mt-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <a href={config.logo.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                  {config.logo.url.split('/').pop()}
                </a>
              </div>
            )}
            <input
              type="text"
              name="logo_alt_text"
              placeholder="Texto alternativo del logo"
              value={config.logo.alt_text}
              onChange={handleInputChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <motion.button
              type="submit"
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-5 h-5 mr-2" /> Guardar Configuración
            </motion.button>
          </div>
        </form>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default WebConfigManagement;