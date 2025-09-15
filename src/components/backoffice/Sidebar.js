import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Tag, Calendar, Image, Palette, Gem, Users, LogOut } from 'lucide-react';

const Sidebar = ({ activeSection, onNavigate, onLogout }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
    { name: 'Ofertas', icon: Tag, section: 'offers' },
    { name: 'Eventos', icon: Calendar, section: 'events' },
    { name: 'Banners', icon: Image, section: 'banners' },
    { name: 'Colores y Logo', icon: Palette, section: 'web_config' },
    { name: 'Beneficios', icon: Gem, section: 'benefits' },
    { name: 'Gestión de Accesos', icon: Users, section: 'access_management' },
  ];

  return (
    <motion.div
      className="w-64 bg-gray-800 text-white flex flex-col h-screen p-4 shadow-lg"
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-2xl font-bold text-center mb-8 text-orange-400">
        Mia Market BO
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.section} className="mb-2">
              <motion.button
                onClick={() => onNavigate(item.section)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activeSection === item.section
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                whileHover={{ x: 5 }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-700 pt-4">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors duration-200"
          whileHover={{ x: 5 }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;