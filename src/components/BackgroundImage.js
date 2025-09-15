import React from 'react';
import { motion } from 'framer-motion';

const BackgroundImage = () => {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      <motion.div 
        className="absolute right-0 top-0 w-1/2 h-full opacity-10"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <img 
          src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0gklVXyByGbrS9nEWZQlfP5u0qJcMdT1UxIvR" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </div>
  );
};

export default BackgroundImage;