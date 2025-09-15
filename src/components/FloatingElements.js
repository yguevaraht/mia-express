import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Gift } from 'lucide-react';

const FloatingElements = () => {
  const elements = [
    { Icon: ShoppingCart, delay: 0, x: '10%', y: '20%' },
    { Icon: Heart, delay: 2, x: '85%', y: '15%' },
    { Icon: Star, delay: 4, x: '15%', y: '70%' },
    { Icon: Gift, delay: 6, x: '80%', y: '75%' }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {elements.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 8,
            delay: delay,
            repeat: Infinity,
            repeatDelay: 8
          }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;