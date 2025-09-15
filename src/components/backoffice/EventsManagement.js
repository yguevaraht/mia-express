import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, XCircle, AlertCircle, CheckCircle, Calendar, MapPin, Clock, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', event_date: '', event_time: '', location: '', image_url: ''
  });
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const RECOMMENDED_DIMENSIONS = "1200x800px (relación de aspecto 3:2)";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      setError('Error al cargar los eventos: ' + error.message);
      setEvents([]);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date || '',
      event_time: event.event_time || '',
      location: event.location || '',
      image_url: event.image_url || ''
    });
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el evento.' });
    } else {
      setEvents(events.filter((event) => event.id !== id));
      setMessage({ type: 'success', text: 'Evento eliminado con éxito.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const payload = {
      ...form,
    };

    if (editingEvent) {
      const { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', editingEvent.id)
        .select();

      if (error) {
        console.error('Error updating event:', error);
        setMessage({ type: 'error', text: 'Error al actualizar el evento.' });
      } else {
        setEvents(events.map((event) => (event.id === editingEvent.id ? data[0] : event)));
        setMessage({ type: 'success', text: 'Evento actualizado con éxito.' });
        setEditingEvent(null);
        setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '' });
      }
    } else {
      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select();

      if (error) {
        console.error('Error adding event:', error);
        setMessage({ type: 'error', text: 'Error al añadir el evento.' });
      } else {
        setEvents([data[0], ...events]);
        setMessage({ type: 'success', text: 'Evento añadido con éxito.' });
        setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '' });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '' });
    setMessage(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Cargando eventos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Eventos</h2>

      {/* Formulario de Añadir/Editar Evento */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {editingEvent ? 'Editar Evento' : 'Añadir Nuevo Evento'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Título del evento"
            value={form.title}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={form.location}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción del evento"
            value={form.description}
            onChange={handleInputChange}
            rows="3"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
            required
          ></textarea>
          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          />
          <input
            type="time"
            name="event_time"
            value={form.event_time}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          />
          
          {/* Campo de subida de imagen */}
          <div className="md:col-span-2">
            <label htmlFor="event-image-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Evento ({RECOMMENDED_DIMENSIONS})
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="event-image-upload"
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

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            {editingEvent && (
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
              <Save className="w-5 h-5 mr-2" /> {editingEvent ? 'Actualizar Evento' : 'Añadir Evento'}
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

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Array.isArray(events) && events.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.event_date}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.event_time}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <motion.button
                    onClick={() => handleEdit(event)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(event.id)}
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

export default EventsManagement;