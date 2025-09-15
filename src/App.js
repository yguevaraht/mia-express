import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import BackgroundImage from './components/BackgroundImage';
import FloatingElements from './components/FloatingElements';
import HomePage from './components/HomePage';
import OffersPage from './components/OffersPage';
import LoginModal from './components/auth/login/LoginModal';
import ForgotPasswordModal from './components/auth/forgot_password/ForgotPasswordModal';
import RegistrationForm from './components/auth/registration/RegistrationForm';
import BackOfficeApp from './components/backoffice/auth/BackOfficeApp';
import Footer from './components/Footer';
import { supabase } from './utils/supabase';

const App = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [showBackOffice, setShowBackOffice] = useState(false);
  const [webConfig, setWebConfig] = useState({
    primary_color: '#FF5722', // Default
    secondary_color: '#FFC107', // Default
    site_title: 'Mia Club', // Default
    logo: { url: '', alt_text: '' } // Default
  });

  useEffect(() => {
    const fetchWebConfig = async () => {
      const { data, error } = await supabase
        .from('web_config')
        .select('*');

      if (error) {
        console.error('Error fetching web config:', error);
      } else {
        const fetchedConfig = {};
        data.forEach(item => {
          fetchedConfig[item.config_name] = item.config_value;
        });
        setWebConfig(prevConfig => ({
          ...prevConfig,
          ...fetchedConfig,
          logo: fetchedConfig.logo || { url: '', alt_text: '' },
        }));
      }
    };

    fetchWebConfig();

    // Escuchar eventos de actualización de configuración desde el BackOffice
    window.addEventListener('webConfigUpdated', fetchWebConfig);

    return () => {
      window.removeEventListener('webConfigUpdated', fetchWebConfig);
    };
  }, []);

  // Aplicar colores a variables CSS
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', webConfig.primary_color);
    document.documentElement.style.setProperty('--secondary-color', webConfig.secondary_color);
  }, [webConfig.primary_color, webConfig.secondary_color]);

  const handleAdminLogin = () => {
    setShowBackOffice(true);
  };

  const handleGoToHome = () => {
    setShowBackOffice(false);
    setShowRegistration(false);
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const handleNavigateToRegister = () => {
    setShowRegistration(true);
    setIsLoginModalOpen(false);
    setShowBackOffice(false);
  };

  const handleNavigateToLogin = () => {
    setIsLoginModalOpen(true);
    setShowRegistration(false);
    setShowBackOffice(false);
  };

  const handleRegistrationSuccess = (formData) => {
    setUserProfile(formData);
    setIsLoggedIn(true);
    setShowRegistration(false);
  };

  const handleLoginSuccess = (userData) => {
    setUserProfile(userData);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    console.log("Perfil actualizado en App.js:", updatedProfile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile({});
    setShowBackOffice(false);
  };

  const handleOpenForgotPassword = () => {
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  if (showBackOffice) {
    return <BackOfficeApp onGoToHome={handleGoToHome} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen relative flex flex-col">
        <BackgroundImage />
        <FloatingElements />
        
        <Header 
          onNavigateToLogin={handleNavigateToLogin} 
          onNavigateToRegister={handleNavigateToRegister} 
          isLoggedIn={isLoggedIn} 
          userProfile={userProfile} 
          onLogout={handleLogout} 
          onGoToHome={handleGoToHome}
          webConfig={webConfig} // Pasa la configuración web al Header
        />

        <div className="relative z-20 flex-grow pt-20">
          {isLoggedIn ? (
            <OffersPage 
              userProfile={userProfile} 
              onSaveProfile={handleSaveProfile} 
              onLogout={handleLogout}
            />
          ) : (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {!showRegistration ? (
                  <HomePage 
                    onNavigateToRegister={handleNavigateToRegister} 
                    onNavigateToLogin={handleNavigateToLogin} 
                    onAdminLogin={handleAdminLogin}
                    webConfig={webConfig} // Pasa la configuración web al HomePage
                  />
                ) : (
                  <>
                    <div className="max-w-2xl mx-auto">
                      <RegistrationForm 
                        onRegistrationSuccess={handleRegistrationSuccess} 
                        onNavigateToLogin={handleNavigateToLogin}
                        onGoToHome={handleGoToHome}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </div>

        <Footer onAdminLogin={handleAdminLogin} />

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={handleOpenForgotPassword}
        />

        <ForgotPasswordModal 
          isOpen={isForgotPasswordModalOpen} 
          onClose={() => setIsForgotPasswordModalOpen(false)} 
        />
      </div>
    </BrowserRouter>
  );
};

export default App;