import { createContext, useContext, useEffect, useState } from 'react';
import { apiPost } from '../api/api'; // tu helper (ver abajo)

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Mapa simple id_perfil -> ROLE
const PROFILE_MAP = {
  1: 'ROLE_ADMON',
  2: 'ROLE_CLIENTE',
  3: 'ROLE_TRABAJADOR',
  4: 'ROLE_JEFE',
};

// Normaliza lo mínimo que necesitamos (id y rol)
function normalizeUser(u) {
  if (!u) return null;
  const idPerfil = u.perfil?.idPerfil ?? u.id_perfil ?? null;
  const nombreRol = u.perfil?.nombre ?? PROFILE_MAP[idPerfil] ?? '';
  return {
    ...u,
    perfil: { idPerfil, nombre: nombreRol }
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true); // <- nuevo: marca que estamos cargando la sesión

  // Al arrancar, cargar lo guardado en localStorage (si hay)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (parseErr) {
          // si hay un error al parsear, limpiamos localStorage
          console.error('Error parsing stored user:', parseErr);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      // protección extra por si localStorage falla por permisos
      console.error('Error reading localStorage:', err);
      setUser(null);
    } finally {
      // indicamos que hemos intentado inicializar la sesión
      setInitializing(false);
    }
  }, []);

  // Login: llama al backend y guarda el user normalizado
  async function login(username, password) {
    try {
      const res = await apiPost('/api/login', { username, password });
      // apiPost debe devolver el usuario (JSON) o lanzar error
      const normalized = normalizeUser(res);
      setUser(normalized);
      localStorage.setItem('user', JSON.stringify(normalized));
      return normalized; // devuelve el user para que Login.jsx pueda redirigir
    } catch (err) {
      console.error('Login error:', err);
      return null;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user');
    // opcional: llamar a backend /logout si lo tienes
  }

  // Exponemos initializing para que ProtectedRoute espere mientras cargamos
  const value = { user, login, logout, initializing };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}