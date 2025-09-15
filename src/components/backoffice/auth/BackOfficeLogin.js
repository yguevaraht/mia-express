import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import ForgotPasswordBackOfficeModal from './ForgotPasswordBackOfficeModal';

const BackOfficeLogin = ({ onLoginSuccess, onGoHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setMessage('Por favor, introduce tu email y contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      // Autenticación con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // Manejo de errores específicos de Supabase Auth
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Email o contraseña incorrectos.');
        } else {
          setMessage(`Error al iniciar sesión: ${error.message}`);
        }
      } else if (data.user) {
        // Si la autenticación es exitosa, obtenemos el perfil del usuario de backoffice_users
        const { data: backofficeUser, error: profileError } = await supabase
          .from('backoffice_users')
          .select('*')
          .eq('email', email)
          .single();

        if (profileError || !backofficeUser) {
          // Si el usuario no está en backoffice_users o hay un error, no permitimos el acceso
          console.error('Error fetching backoffice user profile:', profileError);
          setMessage('Acceso denegado: Tu cuenta no tiene permisos de BackOffice.');
          await supabase.auth.signOut(); // Cierra la sesión si no tiene perfil de BO
        } else {
          // Login exitoso, pasa el objeto de usuario con su rol
          onLoginSuccess({ 
            id: backofficeUser.id, 
            email: backofficeUser.email, 
            name: backofficeUser.email.split('@')[0],
            role: backofficeUser.role 
          });
        }
      } else {
        setMessage('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (err) {
      setMessage('Ocurrió un error inesperado. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full relative text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onGoHome}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center text-orange-400 mb-8">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email de administrador"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          {message && (
            <motion.div
              className="p-3 rounded-xl flex items-center gap-3 bg-red-700 text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="w-5 h-5" />
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
                Iniciar Sesión
                <LogIn className="w-5 h-5" />
              </>
            )}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={() => setIsForgotPasswordModalOpen(true)}
            className="w-full text-sm text-orange-400 font-semibold mt-4 hover:underline transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ¿Olvidaste tu contraseña?
          </motion.button>
        </form>
      </motion.div>

      <ForgotPasswordBackOfficeModal 
        isOpen={isForgotPasswordModalOpen} 
        onClose={() => setIsForgotPasswordModalOpen(false)} 
      />
    </motion.div>
  );
};

export default BackOfficeLogin;