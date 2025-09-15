import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Save, XCircle, AlertCircle, CheckCircle, User, Mail, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const AccessManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ role: '', is_active: false });
  const [message, setMessage] = useState(null);

  const roles = ['Administrador', 'Editor', 'Visualizador'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('backoffice_users')
      .select('*')
      .order('email', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios: ' + error.message);
      setUsers([]); // Asegura que users sea un array vacío en caso de error
    } else {
      setUsers(data || []); // Asegura que users sea un array incluso si data es null
    }
    setLoading(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ role: user.role, is_active: user.is_active });
    setMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!editingUser) return;

    const { data, error } = await supabase
      .from('backoffice_users')
      .update(form)
      .eq('id', editingUser.id)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el usuario.' });
    } else {
      setUsers(users.map((user) => (user.id === editingUser.id ? data[0] : user)));
      setMessage({ type: 'success', text: 'Usuario actualizado con éxito.' });
      setEditingUser(null);
      setForm({ role: '', is_active: false });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({ role: '', is_active: false });
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    const { error } = await supabase
      .from('backoffice_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el usuario.' });
    } else {
      setUsers(users.filter((user) => user.id !== id));
      setMessage({ type: 'success', text: 'Usuario eliminado con éxito.' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Cargando usuarios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Accesos</h2>

      {/* Mensajes de estado */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-3 rounded-xl flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(users) && users.map((user) => (
              <motion.tr
                key={user?.id || Math.random()} // Añade verificación para user.id y fallback
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser && editingUser.id === user?.id ? ( // Añade verificación para user?.id
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-900">{user?.role || 'N/A'}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser && editingUser.id === user?.id ? ( // Añade verificación para user?.id
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">{form.is_active ? 'Sí' : 'No'}</span>
                    </label>
                  ) : (
                    <div className="flex items-center">
                      {user?.is_active ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">{user?.is_active ? 'Sí' : 'No'}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingUser && editingUser.id === user?.id ? ( // Añade verificación para user?.id
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={handleSubmit}
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Save className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={handleCancelEdit}
                        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <XCircle className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(user?.id)} // Añade verificación para user?.id
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AccessManagement;