import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, initializing } = useAuth();

  // Esperar a que el AuthContext termine de inicializar (leer localStorage)
  if (initializing) return null; // o <div>Loading...</div>

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles || allowedRoles.length === 0) return children;

  const userRole = user?.perfil?.nombre;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}