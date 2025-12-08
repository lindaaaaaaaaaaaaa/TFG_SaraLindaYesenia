import { useEffect, useState } from "react";
import { apiGet } from "../api/api";
import { useAuth } from '../context/AuthContext';
import "./Administrador.css";

export default function Trabajador() {
  const [misDatos, setMisDatos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const { user, logout } = useAuth();

  // Cargar datos de la API
  useEffect(() => {
    cargarDatos();
  }, [user]);

  async function cargarDatos() {
    try {
      const resTrabajadores = await apiGet('/rol/3'); // Datos del trabajador
      const resClientes = await apiGet('/rol/2');

      setMisDatos(resTrabajadores);
      setClientes(resClientes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  // Aplicar clase dark mode al body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleMenuItemClick = (index) => {
    setActiveMenuItem(index);
  };

  const menuItems = [
    { text: 'Dashboard', href: '#', icon: 'bxs-dashboard' },
    { text: 'Clientes', href: '#', icon: 'bxs-user' }
  ];

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
          <i className='bx bxs-smile'></i>
          <span className="text">TrabajadorHub</span>
        </a>
        
        <ul className="side-menu top">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className={activeMenuItem === index ? 'active' : ''}
              onClick={() => handleMenuItemClick(index)}
            >
              <a href={item.href}>
                <i className={`bx ${item.icon}`}></i>
                <span className="text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
        
        <ul className="side-menu bottom">
          <li>
            <a href="#" className="logout">
              <i className='bx bx-power-off'></i>
              <span className="text" onClick={logout}>Logout</span>
            </a>
          </li>
        </ul>
      </section>

      {/* CONTENT */}
      <section id="content">
        {/* NAVBAR */}
        <nav>
          <div className="switch-mode" onClick={toggleDarkMode}>
            <div className="ball"></div>
            <img 
              src={darkMode ? '/sun.png' : '/moon.png'} 
              alt={darkMode ? "Sol" : "Luna"} 
              className="mode-icon"
              style={darkMode ? { transform: 'translate(-20px, 0px)' } : {}}
            />
          </div>
        </nav>

        {/* MAIN */}
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard Trabajador</h1>
            </div>
          </div>

          {/* Tabla - Mis Datos del Trabajador */}
          <div className="table-data">
            <div className="order order-full-width">
              <div className="head">
                <h3>Datos de Trabajador</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Username</th>
                    <th>Dirección</th>
                    <th>Fecha Nacimiento</th>
                    <th>Fecha Registro</th>
                    <th>Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {misDatos.length > 0 ? (
                    misDatos.map((trabajador, i) => (
                      <tr key={i}>
                        <td>{trabajador.nombre}</td>
                        <td>{trabajador.apellidos}</td>
                        <td>{trabajador.username}</td>
                        <td>{trabajador.direccion}</td>
                        <td>{trabajador.fechaNacimiento}</td>
                        <td>{trabajador.fechaRegistro}</td>
                        <td>{trabajador.enabled}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="box-info">
            <li>
              <i className='bx bxs-calendar-check'></i>
              <span className="text">
                <h3>1020</h3>
                <p>Tareas Completadas</p>
              </span>
            </li>
            <li>
              <i className='bx bxs-group'></i>
              <span className="text">
                <h3>{clientes.length}</h3>
                <p>Clientes</p>
              </span>
            </li>
            <li>
              <i className='bx bxs-dollar-circle'></i>
              <span className="text">
                <h3>$2543.00</h3>
                <p>Total Sales</p>
              </span>
            </li>
          </ul>

          <div className="table-data">
            <TablaClientes titulo="Clientes" datos={clientes} />
          </div>
        </main>
      </section>
    </div>
  );
}

function TablaClientes({ titulo, datos }) {
  return (
    <div className="order order-full-width">
      <div className="head">
        <h3>{titulo}</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Username</th>
            <th>Fecha Registro</th>
            <th>Fecha Nacimiento</th>
            <th>Direccion</th>
            <th>Enable</th>
          </tr>
        </thead>
        <tbody>
          {datos && datos.length > 0 ? (
            datos.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellidos}</td>
                <td>{cliente.username}</td>
                <td>{cliente.fechaRegistro}</td>
                <td>{cliente.fechaNacimiento}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.enabled === 1 ? 'Sí' : 'No'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}