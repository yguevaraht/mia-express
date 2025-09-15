import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Dashboard from '../Dashboard';
import OffersManagement from '../OffersManagement';
import EventsManagement from '../EventsManagement';
import BannersManagement from '../BannersManagement';
import WebConfigManagement from '../WebConfigManagement';
import BenefitsManagement from '../BenefitsManagement';
import BackOfficeLogin from './BackOfficeLogin';
import AccessManagement from '../AccessManagement';
import { supabase } from '../../../utils/supabase';
import { Users, LayoutDashboard, Tag, Calendar, Image, Palette, Gem } from 'lucide-react';

const BackOfficeApp = ({ onGoToHome }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        console.log("Session found:", session);
        console.log("Session User ID:", session.user.id);
        console.log("Session User Email:", session.user.email);

        // Intenta obtener el perfil del usuario de backoffice_users
        const { data: backofficeUser, error: profileError } = await supabase
          .from('backoffice_users')
          .select('*')
          .eq('id', session.user.id) // Busca por el ID de Supabase Auth
          .single();

        if (profileError && profileError.code === 'PGRST116') { // No rows found
          // Si el usuario no existe en backoffice_users, lo creamos con un rol predeterminado
          console.warn(`Usuario ${session.user.email} no encontrado en backoffice_users. Creando entrada...`);
          const { data: newBackofficeUser, error: insertError } = await supabase
            .from('backoffice_users')
            .insert([
              {
                id: session.user.id, // Usa el ID de Supabase Auth
                email: session.user.email,
                role: 'Visualizador', // Rol predeterminado para nuevos usuarios
                is_active: true,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error al insertar nuevo usuario en backoffice_users:', insertError);
            await supabase.auth.signOut();
            setLoggedInUser(null);
          } else {
            setLoggedInUser({ 
              id: newBackofficeUser.id, 
              email: newBackofficeUser.email, 
              name: newBackofficeUser.email.split('@')[0], 
              role: newBackofficeUser.role 
            });
          }
        } else if (profileError) {
          console.error('Error fetching backoffice user profile:', profileError);
          await supabase.auth.signOut();
          setLoggedInUser(null);
        } else if (backofficeUser) {
          setLoggedInUser({ 
            id: backofficeUser.id, 
            email: backofficeUser.email, 
            name: backofficeUser.email.split('@')[0], 
            role: backofficeUser.role 
          });
        }
      }
      setLoadingSession(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        console.log("Auth state changed. Session found:", session);
        console.log("Auth state changed. User ID:", session.user.id);
        console.log("Auth state changed. User Email:", session.user.email);

        const { data: backofficeUser, error: profileError } = await supabase
          .from('backoffice_users')
          .select('*')
          .eq('id', session.user.id) // Busca por el ID de Supabase Auth
          .single();

        if (profileError && profileError.code === 'PGRST116') { // No rows found
          console.warn(`Usuario ${session.user.email} no encontrado en backoffice_users. Creando entrada...`);
          const { data: newBackofficeUser, error: insertError } = await supabase
            .from('backoffice_users')
            .insert([
              {
                id: session.user.id, // Usa el ID de Supabase Auth
                email: session.user.email,
                role: 'Visualizador', // Rol predeterminado para nuevos usuarios
                is_active: true,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error al insertar nuevo usuario en backoffice_users:', insertError);
            await supabase.auth.signOut();
            setLoggedInUser(null);
          } else {
            setLoggedInUser({ 
              id: newBackofficeUser.id, 
              email: newBackofficeUser.email, 
              name: newBackofficeUser.email.split('@')[0], 
              role: newBackofficeUser.role 
            });
          }
        } else if (profileError) {
          console.error('Error fetching backoffice user profile:', profileError);
          await supabase.auth.signOut();
          setLoggedInUser(null);
        } else if (backofficeUser) {
          setLoggedInUser({ 
            id: backofficeUser.id, 
            email: backofficeUser.email, 
            name: backofficeUser.email.split('@')[0], 
            role: backofficeUser.role 
          });
        }
      } else {
        setLoggedInUser(null);
      }
      setLoadingSession(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = async () => {
    setLoadingSession(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    } else {
      setLoggedInUser(null);
    }
    setLoadingSession(false);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
    { name: 'Ofertas', icon: Tag, section: 'offers' },
    { name: 'Eventos', icon: Calendar, section: 'events' },
    { name: 'Banners', icon: Image, section: 'banners' },
    { name: 'Colores y Logo', icon: Palette, section: 'web_config' },
    { name: 'Beneficios', icon: Gem, section: 'benefits' },
    { name: 'Gestión de Accesos', icon: Users, section: 'access_management' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'offers':
        return <OffersManagement />;
      case 'events':
        return <EventsManagement />;
      case 'banners':
        return <BannersManagement />;
      case 'web_config':
        return <WebConfigManagement />;
      case 'benefits':
        return <BenefitsManagement />;
      case 'access_management':
        return <AccessManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Cargando sesión del BackOffice...
      </div>
    );
  }

  if (!loggedInUser) {
    return <BackOfficeLogin onLoginSuccess={handleLoginSuccess} onGoHome={onGoToHome} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        onLogout={handleLogout} 
        navItems={navItems}
      />
      <div className="flex-1 flex flex-col">
        <Header title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/_/g, ' ')} userName={loggedInUser.name || loggedInUser.email} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default BackOfficeApp;