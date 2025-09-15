import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Calendar, X, CreditCard, Building } from 'lucide-react'; // Importa CreditCard y Building
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RegistrationForm = ({ onRegistrationSuccess, onNavigateToLogin, onGoToHome }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    birthDate: null,
    dni: '', // Nuevo campo DNI
    ruc: '', // Nuevo campo RUC (opcional)
    companyName: '', // Nuevo campo Razón Social (opcional)
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, birthDate: date });
    setErrors({ ...errors, birthDate: '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio.';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio.';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido.';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio.';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria.';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria.';
    if (!formData.dni.trim()) { // Validación DNI
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (formData.dni.trim().length !== 8 || !/^\d+$/.test(formData.dni.trim())) {
      newErrors.dni = 'El DNI debe tener 8 dígitos numéricos.';
    }

    // Validaciones opcionales para RUC y Razón Social
    if (formData.ruc.trim() && (formData.ruc.trim().length !== 11 || !/^\d+$/.test(formData.ruc.trim()))) {
      newErrors.ruc = 'El RUC debe tener 11 dígitos numéricos.';
    }
    if (formData.ruc.trim() && !formData.companyName.trim()) {
      newErrors.companyName = 'La Razón Social es obligatoria si se ingresa RUC.';
    }
    if (formData.companyName.trim() && !formData.ruc.trim()) {
      newErrors.ruc = 'El RUC es obligatorio si se ingresa Razón Social.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Formulario enviado:', formData);
        setMessage('¡Registro exitoso! Redirigiendo...');
        onRegistrationSuccess(formData);
      } catch (error) {
        setMessage('Error en el registro. Inténtalo de nuevo.');
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage('Por favor, corrige los errores del formulario.');
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Botón de cerrar */}
      <motion.button
        onClick={onGoToHome}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Regístrate en Mia Club</h2>
      <p className="text-gray-600 text-center mb-8">
        Únete a nuestra comunidad y empieza a disfrutar de beneficios exclusivos.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="sr-only">Nombre</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nombre"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="sr-only">Apellido</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Apellido"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* DNI */}
        <div>
          <label htmlFor="dni" className="sr-only">DNI</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="DNI"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.dni ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
              maxLength="8"
            />
            {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="sr-only">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="sr-only">Dirección</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
        </div>

        {/* Birth Date */}
        <div className="md:col-span-2">
          <label htmlFor="birthDate" className="sr-only">Fecha de Nacimiento</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <DatePicker
              id="birthDate"
              selected={formData.birthDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Fecha de Nacimiento"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.birthDate ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
          </div>
        </div>

        {/* RUC (Optional) */}
        <div>
          <label htmlFor="ruc" className="sr-only">RUC (Opcional)</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="ruc"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              placeholder="RUC (Opcional)"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.ruc ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
              maxLength="11"
            />
            {errors.ruc && <p className="text-red-500 text-xs mt-1">{errors.ruc}</p>}
          </div>
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label htmlFor="companyName" className="sr-only">Razón Social (Opcional)</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Razón Social (Opcional)"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.companyName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500`}
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
          </div>
        </div>

        {message && (
          <motion.div
            className={`md:col-span-2 p-3 rounded-xl flex items-center gap-3 ${
              message.includes('exitoso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message.includes('exitoso') ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message}</p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              Registrarse
              <User className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      <p className="text-center text-gray-600 text-sm mt-8">
        ¿Ya tienes una cuenta?{' '}
        <motion.button
          onClick={onNavigateToLogin}
          className="text-orange-500 font-semibold hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Inicia Sesión aquí
        </motion.button>
      </p>
    </motion.div>
  );
};

export default RegistrationForm;