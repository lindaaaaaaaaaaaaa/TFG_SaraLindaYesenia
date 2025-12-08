import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Administrador from './pages/Administrador';
import Jefe from './pages/Jefe';
import Trabajador from './pages/Trabajador';
import Cliente from './pages/Cliente';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard puede ser una landing común o también redirigir según rol */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        {/* Rutas específicas por rol comentario nuevo*/}
        <Route
          path="/administrador"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMON']}>
              <Administrador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jefe"
          element={
            <ProtectedRoute allowedRoles={['ROLE_JEFE']}>
              <Jefe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajador"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRABAJADOR']}>
              <Trabajador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENTE']}>
              <Cliente />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
