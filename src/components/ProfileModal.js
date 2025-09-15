import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, CreditCard, Lock, Save, AlertCircle, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker'; // Importa react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Importa los estilos CSS

const ProfileModal = ({ isOpen, onClose, userData, onSaveProfile }) => {
  const [profileData, setProfileData] = useState(userData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setProfileData(userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setProfileData(prev => ({ ...prev, birthDate: date ? date.toISOString().split('T')[0] : '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    // Simular una llamada a la API para guardar el perfil
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Aquí iría la lógica real para guardar el perfil
    // Por ahora, simulamos éxito o fallo
    const success = Math.random() > 0.1; // 90% de éxito

    if (success) {
      setSaveMessage('¡Perfil actualizado con éxito!');
      setIsSuccess(true);
      onSaveProfile(profileData); // Actualiza los datos en el componente padre
      setTimeout(() => {
        onClose(); // Cierra el modal después de un tiempo
      }, 1000);
    } else {
      setSaveMessage('Error al guardar el perfil. Inténtalo de nuevo.');
      setIsSuccess(false);
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Editar Perfil
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" /> Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" /> Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                disabled // Email suele ser inmutable
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" /> Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" /> Fecha de Nacimiento
                </label>
                <DatePicker
                  selected={profileData.birthDate ? new Date(profileData.birthDate) : null}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                  placeholderText="Selecciona tu fecha"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" /> Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profileData.address || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
              />
            </div>

            {/* Document Type and Number - Oculto en móvil, visible en desktop */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="documentType" className="block text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" /> Tipo de Documento
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  value={profileData.documentType || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                >
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="CE">Carnet de Extranjería</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" /> Número de Documento
                </label>
                <input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  value={profileData.documentNumber || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300"
                />
              </div>
            </div>

            {saveMessage && (
              <motion.div
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isSuccess ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-medium">{saveMessage}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSaving}
            >
              {isSaving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Guardar Cambios
                  <Save className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;