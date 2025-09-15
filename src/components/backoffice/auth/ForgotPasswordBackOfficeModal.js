import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../../utils/supabase';

const ForgotPasswordBackOfficeModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Por favor, introduce un email válido.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/backoffice/reset-password',
      });

      if (error) {
        setMessage(`Error al enviar el enlace: ${error.message}`);
        setIsSuccess(false);
      } else {
        setMessage('Se ha enviado un enlace de recuperación a tu email. Por favor, revisa tu bandeja de entrada.');
        setIsSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setMessage('Ocurrió un error inesperado. Inténtalo de nuevo.');
      console.error(err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full relative text-white"
            initial={{ scale: 0.5, opacity: 0 }} // Estado inicial más pequeño y transparente
            animate={{ scale: 1, opacity: 1 }} // Estado final normal
            transition={{ 
              type: "spring", 
              damping: 10, // Menor damping para más rebote
              stiffness: 300, // Mayor stiffness para más rebote
              duration: 0.5 // Duración de la animación
            }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.3 } }} // Efecto de transición al salir
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
              ¿Olvidaste tu Contraseña?
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgot-email-bo" className="sr-only">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="forgot-email-bo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {message && (
                <motion.div
                  className={`p-3 rounded-xl flex items-center gap-3 ${
                    isSuccess ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {isSuccess ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="text-sm font-medium">{message}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Restablecer Contraseña
                    <Mail className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordBackOfficeModal;