import React from 'react';
import { motion } from 'framer-motion';
import { Bell, UserCircle } from 'lucide-react';

const Header = ({ title, userName }) => {
  return (
    <motion.header
      className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <motion.button
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="w-6 h-6" />
        </motion.button>
        <div className="flex items-center space-x-2">
          <UserCircle className="w-8 h-8 text-gray-500" />
          <span className="font-medium text-gray-700">{userName || 'Admin'}</span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;