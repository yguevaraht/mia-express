import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Calendar, Image, Gem, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Ofertas Activas', value: '12', icon: Tag, color: 'text-blue-500' },
    { title: 'Próximos Eventos', value: '3', icon: Calendar, color: 'text-green-500' },
    { title: 'Banners Publicados', value: '5', icon: Image, color: 'text-purple-500' },
    { title: 'Beneficios Activos', value: '8', icon: Gem, color: 'text-yellow-500' },
  ];

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Resumen del Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          >
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-700">
              <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
              Nueva oferta "Verano Feliz" publicada.
            </li>
            <li className="flex items-center text-gray-700">
              <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
              Evento "Clase de Cocina" actualizado.
            </li>
            <li className="flex items-center text-gray-700">
              <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
              Banner principal modificado.
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Tareas Pendientes</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Revisar ofertas expiradas.
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
              Programar nuevo evento para Julio.
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Actualizar logo en configuración web.
            </li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;