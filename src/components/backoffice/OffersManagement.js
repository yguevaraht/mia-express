import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, XCircle, AlertCircle, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', discount: '', image_url: '', start_date: '', end_date: '', is_active: true
  });
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const RECOMMENDED_DIMENSIONS = "800x600px (relación de aspecto 4:3)";

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('end_date', { ascending: false });

    if (error) {
      console.error('Error fetching offers:', error);
      setError('Error al cargar las ofertas: ' + error.message);
      setOffers([]);
    } else {
      setOffers(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const filePath = `public/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('mia-club-images') // Asegúrate de que este bucket exista en Supabase Storage
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Error al subir la imagen: ' + error.message });
    } else {
      const publicURL = supabase.storage.from('mia-club-images').getPublicUrl(filePath).data.publicUrl;
      setForm((prevForm) => ({ ...prevForm, image_url: publicURL }));
      setMessage({ type: 'success', text: 'Imagen subida con éxito.' });
    }
    setUploading(false);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setForm({
      title: offer.title,
      description: offer.description || '',
      discount: offer.discount || '',
      image_url: offer.image_url || '',
      start_date: offer.start_date || '',
      end_date: offer.end_date || '',
      is_active: offer.is_active
    });
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) return;

    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting offer:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la oferta.' });
    } else {
      setOffers(offers.filter((offer) => offer.id !== id));
      setMessage({ type: 'success', text: 'Oferta eliminada con éxito.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...form,
    };

    if (editingOffer) {
      const { data, error } = await supabase
        .from('offers')
        .update(payload)
        .eq('id', editingOffer.id)
        .select();

      if (error) {
        console.error('Error updating offer:', error);
        setMessage({ type: 'error', text: 'Error al actualizar la oferta.' });
      } else {
        setOffers(offers.map((offer) => (offer.id === editingOffer.id ? data[0] : offer)));
        setMessage({ type: 'success', text: 'Oferta actualizada con éxito.' });
        setEditingOffer(null);
        setForm({ title: '', description: '', discount: '', image_url: '', start_date: '', end_date: '', is_active: true });
      }
    } else {
      const { data, error } = await supabase
        .from('offers')
        .insert([payload])
        .select();

      if (error) {
        console.error('Error adding offer:', error);
        setMessage({ type: 'error', text: 'Error al añadir la oferta.' });
      } else {
        setOffers([data[0], ...offers]);
        setMessage({ type: 'success', text: 'Oferta añadida con éxito.' });
        setForm({ title: '', description: '', discount: '', image_url: '', start_date: '', end_date: '', is_active: true });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingOffer(null);
    setForm({ title: '', description: '', discount: '', image_url: '', start_date: '', end_date: '', is_active: true });
    setMessage(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Cargando ofertas...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Ofertas</h2>

      {/* Formulario de Añadir/Editar Oferta */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {editingOffer ? 'Editar Oferta' : 'Añadir Nueva Oferta'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Título de la oferta"
            value={form.title}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="text"
            name="discount"
            placeholder="Descuento (ej. 20% OFF)"
            value={form.discount}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción de la oferta"
            value={form.description}
            onChange={handleInputChange}
            rows="3"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
            required
          ></textarea>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          />

          {/* Campo de subida de imagen */}
          <div className="md:col-span-2">
            <label htmlFor="offer-image-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la Oferta ({RECOMMENDED_DIMENSIONS})
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="offer-image-upload"
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
            {form.image_url && (
              <div className="mt-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <a href={form.image_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                  {form.image_url.split('/').pop()}
                </a>
              </div>
            )}
          </div>

          {/* Checkbox de Activo */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active_offer"
              checked={form.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active_offer" className="ml-2 block text-sm text-gray-900">
              Activo
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            {editingOffer && (
              <motion.button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="w-5 h-5 mr-2" /> Cancelar
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-5 h-5 mr-2" /> {editingOffer ? 'Actualizar Oferta' : 'Añadir Oferta'}
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

      {/* Lista de Ofertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Array.isArray(offers) && offers.map((offer) => (
            <motion.div
              key={offer.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <img src={offer.image_url} alt={offer.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{offer.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span>{offer.discount}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span>{offer.start_date} - {offer.end_date}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  {offer.is_active ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span>{offer.is_active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <motion.button
                    onClick={() => handleEdit(offer)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OffersManagement;