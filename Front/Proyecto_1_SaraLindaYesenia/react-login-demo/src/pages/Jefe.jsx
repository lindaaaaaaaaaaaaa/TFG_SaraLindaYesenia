import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";
import { useAuth } from '../context/AuthContext';
import "./Administrador.css"; // Usamos el mismo CSS

export default function Jefe() {
  const [misDatos, setMisDatos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  // Estados para los modales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    username: "",
    password: "",
    direccion: "",
    fechaNacimiento: "",
    enabled: 1,
    fechaRegistro: new Date().toISOString().split('T')[0],
    idPerfil: 3 // Trabajadores tienen idPerfil 3
  });

  // Cargar datos de la API
  useEffect(() => {
    cargarDatos();
  }, [user]);

  async function cargarDatos() {
    try {
      const resJefes = await apiGet('/rol/4');
      const resClientes = await apiGet('/rol/2');
      const resTrabajadores = await apiGet('/rol/3');

      setMisDatos(resJefes);
      setClientes(resClientes);
      setTrabajadores(resTrabajadores);
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

  // Función para abrir el modal de añadir trabajador
  const handleAdd = () => {
    setIsEditMode(false);
    setEditingUser(null);

    setFormData({
      nombre: "",
      apellidos: "",
      username: "",
      password: "",
      direccion: "",
      fechaNacimiento: "",
      enabled: 1,
      fechaRegistro: new Date().toISOString().split('T')[0],
      idPerfil: 3 // Trabajadores
    });
    setShowModal(true);
  };

  // Función para abrir el modal de modificar trabajador
  const handleEdit = (usuario) => {
    setIsEditMode(true);
    setEditingUser(usuario);

    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      username: usuario.username,
      password: usuario.password,
      direccion: usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento,
      enabled: usuario.enabled,
      fechaRegistro: usuario.fechaRegistro,
      idPerfil: usuario.idPerfil
    });
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 2) : value
    }));
  };

  // Función para enviar el formulario (Añadir o Modificar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = { ...formData };
      
      // Si no se ingresó contraseña en modo edición, no la enviamos
      if (isEditMode && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (isEditMode) {
        // Modificar usuario existente
      // NO enviar username porque es la clave primaria
        delete dataToSend.username;       
        // Modificar usuario existente
        await apiPut(`/usuario/${editingUser.username}`, dataToSend);
      } else {
        const bodyParaCrear = {
          username: dataToSend.username,
          password: dataToSend.password,
          nombre: dataToSend.nombre,
          apellidos: dataToSend.apellidos,
          direccion: dataToSend.direccion,
          fechaNacimiento: dataToSend.fechaNacimiento,
          enabled: dataToSend.enabled,
          perfil: {
            idPerfil: dataToSend.idPerfil  // 👈 IMPORTANTE: debe ir dentro de "perfil"
          }
        };
        // Añadir nuevo usuario
        await apiPost('/admin/crear', bodyParaCrear);
      }


        setSuccessMessage(isEditMode ? "Trabajador modificado con éxito" : "Trabajador creado con éxito");
        setShowSuccessModal(true);
        handleCloseModal();
        
        // Recargar datos después de 1.5 segundos
        setTimeout(() => {
          cargarDatos();
          setShowSuccessModal(false);
        }, 1500);
    } catch (error) {
      console.error("Error:", error);
      alert('Error al conectar con el servidor');
    }
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      await apiDelete(`/usuario/${userToDelete.username}`);

        setSuccessMessage("Trabajador eliminado con éxito");
        setShowSuccessModal(true);
        handleCloseModal();
        
        // Recargar datos después de 1.5 segundos
        setTimeout(() => {
          cargarDatos();
          setShowSuccessModal(false);
        }, 1500);

    } catch (error) {
      console.error("Error:", error);
      alert('Error al conectar con el servidor');
    }
  };

  const menuItems = [
    { text: 'Dashboard', href: '#', icon: 'bxs-dashboard' },
    { text: 'Trabajadores', href: '#', icon: 'bxs-briefcase' },
    { text: 'Clientes', href: '#', icon: 'bxs-user' }
  ];

  return (
    <div>
      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
          <i className='bx bxs-smile'></i>
          <span className="text">JefeHub</span>
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
              <h1>Dashboard Jefe</h1>
            </div>
          </div>

          {/* Tabla - Mis Datos del Jefe */}
          <div className="table-data">
            <div className="order order-full-width">
              <div className="head">
                <h3>Datos de Jefe</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {misDatos.length > 0 ? (
                    misDatos.map((jefe, i) => (
                      <tr key={i}>
                        <td>{jefe.nombre}</td>
                        <td>{jefe.apellidos}</td>
                        <td>{jefe.username}</td>
                        <td>{jefe.direccion}</td>
                        <td>{jefe.fechaNacimiento}</td>
                        <td>{jefe.fechaRegistro}</td>
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
              <i className='bx bxs-briefcase'></i>
              <span className="text">
                <h3>{trabajadores.length}</h3>
                <p>Trabajadores</p>
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
            <TablaUsuarios 
              titulo="Trabajadores" 
              datos={trabajadores} 
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            <TablaClientes titulo="Clientes" datos={clientes} />
          </div>
        </main>
      </section>

      {/* MODAL DE AÑADIR/MODIFICAR */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="modal-form">
            <h2>{isEditMode ? 'Modificar Trabajador' : 'Añadir Trabajador'}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  placeholder="Ingresa el nombre" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <input 
                  type="text" 
                  id="apellidos" 
                  name="apellidos" 
                  value={formData.apellidos} 
                  onChange={handleInputChange} 
                  placeholder="Ingresa los apellidos" 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                  placeholder="Ingresa el username" 
                  required 
                  disabled={isEditMode}
                />
                  {isEditMode && (
                    <small style={{ 
                      display: 'block',
                      color: '#888', 
                      fontSize: '12px',
                      fontStyle: 'italic'
                    }}>* El username no se puede modificar (clave primaria)
                    </small>
                  )}
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  Password 
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder="Ingresa la password" 
                  required={!isEditMode}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input 
                  type="text" 
                  id="direccion" 
                  name="direccion" 
                  value={formData.direccion} 
                  onChange={handleInputChange} 
                  placeholder="Ingresa la dirección" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="fechaNacimiento">Fecha Nacimiento</label>
                <input 
                  type="date" 
                  id="fechaNacimiento" 
                  name="fechaNacimiento" 
                  value={formData.fechaNacimiento} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>

            {isEditMode && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaRegistro">Fecha Registro</label>
                  <input 
                    type="date" 
                    id="fechaRegistro" 
                    name="fechaRegistro" 
                    value={formData.fechaRegistro} 
                    onChange={handleInputChange} 
                    required 
                    readOnly 
                  />
                </div>
                <div className="form-group"></div>
              </div>
            )}

            <label htmlFor="enabled" className="checkbox-label">
              <input 
                type="checkbox" 
                id="enabled" 
                name="enabled" 
                checked={formData.enabled === 1} 
                onChange={handleInputChange} 
              />
              <div>Habilitar usuario</div>
            </label>
            
            <div className="modal-buttons">
              <button type="button" className="button cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="submit" className="button submit">
                {isEditMode ? "Guardar Cambios" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <div className={`modal-overlay ${showDeleteModal ? 'active' : ''}`} onClick={handleCloseModal}>
        <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
          <div className="delete-modal-content">
            <div className="delete-icon">
              <img src="/cruz.png" alt="Eliminar" />
            </div>
            <h2>¿Eliminar trabajador?</h2>
            <p>
              ¿Estás seguro de que deseas eliminar a <strong>{userToDelete?.nombre} {userToDelete?.apellidos}</strong>?
              <br />
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-buttons">
              <button type="button" className="button cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="button" className="button delete" onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ÉXITO */}
      <div className={`modal-overlay ${showSuccessModal ? 'active' : ''}`}>
        <div className="modal-content modal-success">
          <div className="success-modal-content">
            <div className="success-icon">
            <img src="/tick.png" alt="tick" />
            </div>
            <h2>¡Éxito!</h2>
            <p>{successMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TablaUsuarios({ titulo, datos, onAdd, onEdit, onDelete }) {
  return (
    <div className="order">
      <div className="head">
        <h3>{titulo}</h3>
        <div className="table-buttons">       
          <button className="buttones" onClick={onAdd}>Añadir</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Username</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos && datos.length > 0 ? (
            datos.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellidos}</td>
                <td>{usuario.username}</td>
                <td>
                  <div className="row-buttons">
                    <button className="buttones" onClick={() => onEdit(usuario)}>
                      Modificar
                    </button>
                    <button className="buttones" onClick={() => onDelete(usuario)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
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