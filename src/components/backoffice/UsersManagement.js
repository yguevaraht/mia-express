import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, XCircle, AlertCircle, CheckCircle, User, Mail, Lock, Search } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    email: '', password: '', role: 'editor' // Añadir campo de rol si se implementa
  });
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // En Supabase, no se puede listar directamente todos los usuarios de auth.users
    // desde el cliente por razones de seguridad.
    // Normalmente, se haría a través de una función de Edge o un RLS muy específico.
    // Para esta simulación, vamos a crear una tabla 'backoffice_users'
    // que contenga los usuarios con acceso al backoffice.
    const { data, error } = await supabase
      .from('backoffice_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      setError('Error al cargar los usuarios. Asegúrate de tener la tabla `backoffice_users` y permisos de RLS configurados.');
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      email: user.email,
      password: '', // Nunca precargar contraseñas
      role: user.role || 'editor'
    });
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) return;

    try {
      // Para eliminar un usuario de auth.users, necesitas una función de Edge o un trigger de base de datos.
      // Aquí simulamos la eliminación de nuestra tabla 'backoffice_users'.
      const { error: dbError } = await supabase
        .from('backoffice_users')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setUsers(users.filter((user) => user.id !== id));
      setMessage({ type: 'success', text: 'Usuario eliminado con éxito.' });
    } catch (err) {
      console.error('Error deleting user:', err);
      setMessage({ type: 'error', text: `Error al eliminar el usuario: ${err.message}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingUser) {
        // Actualizar usuario en nuestra tabla 'backoffice_users'
        const updatePayload = { email: form.email, role: form.role };
        if (form.password) {
          // Si se proporciona una nueva contraseña, también se debería actualizar en auth.users
          // Esto requeriría una función de Edge o un trigger. Aquí solo actualizamos el email/rol.
          // Para una solución completa, se necesitaría un endpoint de admin para actualizar contraseñas.
          console.warn("La actualización de contraseña de usuarios de Supabase Auth no se maneja directamente desde el cliente por seguridad.");
        }

        const { data, error } = await supabase
          .from('backoffice_users')
          .update(updatePayload)
          .eq('id', editingUser.id)
          .select();

        if (error) throw error;

        setUsers(users.map((user) => (user.id === editingUser.id ? data[0] : user)));
        setMessage({ type: 'success', text: 'Usuario actualizado con éxito.' });
      } else {
        // Crear usuario en Supabase Auth y luego en nuestra tabla 'backoffice_users'
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No se pudo crear el usuario en Supabase Auth.");

        const { data, error } = await supabase
          .from('backoffice_users')
          .insert([{ id: authData.user.id, email: form.email, role: form.role }])
          .select();

        if (error) throw error;

        setUsers([data[0], ...users]);
        setMessage({ type: 'success', text: 'Usuario añadido con éxito. Se ha enviado un email de confirmación.' });
      }
      setEditingUser(null);
      setForm({ email: '', password: '', role: 'editor' });
    } catch (err) {
      console.error('Error saving user:', err);
      setMessage({ type: 'error', text: `Error al guardar el usuario: ${err.message}` });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({ email: '', password: '', role: 'editor' });
    setMessage(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) return <div className="p-8 text-center text-gray-600">Cargando usuarios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Gestión de Usuarios</h2>

      {/* Formulario de Añadir/Editar Usuario */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {editingUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email del usuario"
            value={form.email}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            disabled={!!editingUser} // No permitir cambiar el email al editar
          />
          <input
            type="password"
            name="password"
            placeholder={editingUser ? "Dejar en blanco para no cambiar contraseña" : "Contraseña"}
            value={form.password}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required={!editingUser} // Requerir contraseña solo al añadir
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            required
          >
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="viewer">Visualizador</option>
          </select>
          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            {editingUser && (
              <motion.button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="w-5 h-5 mr-2" /> Cancelar
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-5 h-5 mr-2" /> {editingUser ? 'Actualizar Usuario' : 'Añadir Usuario'}
            </motion.button>
          </div>
        </form>
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row items-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          />
        </div>
      </motion.div>

      {/* Lista de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 flex items-center"
            >
              <User className="w-10 h-10 text-gray-500 mr-4 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{user.email}</h3>
                <p className="text-gray-600 text-sm">Rol: {user.role}</p>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleEdit(user)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UsersManagement;