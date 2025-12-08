import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./Administrador.css";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";

export default function Administrador() {
  // Arrays
  const [admins, setAdmins] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [jefes, setJefes] = useState([]);

  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  // Modales / formularios
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTitulo, setCurrentTitulo] = useState("");
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
    idPerfil: 1
  });

  // Refs para scroll (opcional)
  const jefesRef = useRef(null);
  const trabajadoresRef = useRef(null);
  const clientesRef = useRef(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const resAdmins = await apiGet('/rol/1');
      const resClientes = await apiGet('/rol/2');
      const resTrabajadores = await apiGet('/rol/3');
      const resJefes = await apiGet('/rol/4');

      setAdmins(resAdmins || []);
      setClientes(resClientes || []);
      setTrabajadores(resTrabajadores || []);
      setJefes(resJefes || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleMenuItemClick = (index) => {
    setActiveMenuItem(index);
    // opcional: scrollear a la tabla seleccionada
    setTimeout(() => {
      if (index === 1 && jefesRef.current) jefesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (index === 2 && trabajadoresRef.current) trabajadoresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (index === 3 && clientesRef.current) clientesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Modal: añadir
  const handleAdd = (titulo) => {
    setCurrentTitulo(titulo);
    setIsEditMode(false);
    setEditingUser(null);

    let idPerfil;
    if (titulo === "Jefes") idPerfil = 4;
    else if (titulo === "Trabajadores") idPerfil = 3;
    else idPerfil = 1;

    setFormData({
      nombre: "",
      apellidos: "",
      username: "",
      password: "",
      direccion: "",
      fechaNacimiento: "",
      enabled: 1,
      fechaRegistro: new Date().toISOString().split('T')[0],
      idPerfil: idPerfil
    });
    setShowModal(true);
  };

  // Modal: editar
  const handleEdit = (usuario, titulo) => {
    setCurrentTitulo(titulo);
    setIsEditMode(true);
    setEditingUser(usuario);

    let idPerfil;
    if (titulo === "Jefes") idPerfil = 4;
    else if (titulo === "Trabajadores") idPerfil = 3;
    else idPerfil = 1;

    setFormData({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      username: usuario.username,
      password: "",
      direccion: usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento,
      enabled: usuario.enabled,
      fechaRegistro: usuario.fechaRegistro,
      idPerfil: idPerfil
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 2) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (dataToSend.enabled === 2) dataToSend.enabled = 0;
      if (typeof dataToSend.enabled === 'string') {
        const n = Number(dataToSend.enabled);
        if (!Number.isNaN(n)) dataToSend.enabled = (n === 2) ? 0 : n;
      }
      if (dataToSend.password && typeof dataToSend.password === 'string' && dataToSend.password.includes("{noop}")) {
        dataToSend.password = dataToSend.password.replace(/\{noop\}/g, "");
      }
      if (isEditMode && !dataToSend.password) delete dataToSend.password;

      if (isEditMode) {
        delete dataToSend.username;
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
          perfil: { idPerfil: dataToSend.idPerfil }
        };
        await apiPost('/admin/crear', bodyParaCrear);
      }

      setSuccessMessage(isEditMode ? "Usuario modificado con éxito" : "Usuario creado con éxito");
      setShowSuccessModal(true);
      handleCloseModal();

      setTimeout(() => {
        cargarDatos();
        setShowSuccessModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleDeleteClick = (usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiDelete(`/usuario/${userToDelete.username}`);
      setSuccessMessage("Usuario eliminado con éxito");
      setShowSuccessModal(true);
      handleCloseModal();

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
    { text: 'Administrador', href: '#', icon: 'bxs-dashboard', img:'/icon-des.png' },
    { text: 'Jefe', href: '#', icon: 'bxs-group' },
    { text: 'Trabajador', href: '#', icon: 'bxs-briefcase' },
    { text: 'Cliente', href: '#', icon: 'bxs-user' }
  ];

  // Render para la vista "Administrador" (solo mis datos y box-info)
  const renderAdminView = () => (
    <>
      {/* Mis Datos (ocupa todo el ancho) */}
      <div className="order order-full-width">
        <div className="head">
          <h3>Mis Datos</h3>
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
            {admins.length > 0 ? (
              admins.map((admin, i) => (
                <tr key={i}>
                  <td>{admin.nombre}</td>
                  <td>{admin.apellidos}</td>
                  <td>{admin.username}</td>
                  <td>{admin.direccion}</td>
                  <td>{admin.fechaNacimiento}</td>
                  <td>{admin.fechaRegistro}</td>
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
  
      {/* Tarjetas resumen: usan la misma .table-data padre para posicionarse */}
      <ul className="box-info">
        <li>
          <i className='bx bxs-calendar-check'></i>
          <span className="text">
            <h3>1020</h3>
            <p>New Order</p>
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
    </>
  );

  // Render para las tablas (sin "Mis Datos") según la pestaña seleccionada
  const renderTablesOnly = () => {
    if (activeMenuItem === 1) {
      return (
        <TablaUsuarios
          titulo="Jefes"
          datos={jefes}
          onAdd={() => handleAdd("Jefes")}
          onEdit={(usuario) => handleEdit(usuario, "Jefes")}
          onDelete={handleDeleteClick}
          refProp={jefesRef}
        />
      );
    }
    if (activeMenuItem === 2) {
      return (
        <TablaUsuarios
          titulo="Trabajadores"
          datos={trabajadores}
          onAdd={() => handleAdd("Trabajadores")}
          onEdit={(usuario) => handleEdit(usuario, "Trabajadores")}
          onDelete={handleDeleteClick}
          refProp={trabajadoresRef}
        />
      );
    }
    if (activeMenuItem === 3) {
      return <TablaClientes titulo="Clientes" datos={clientes} refProp={clientesRef} />;
    }
    // si por alguna razón no hay match, retorna null
    return null;
  };

  return (
    <div className={`app-container discover-page ${darkMode ? 'dark' : ''}`}>
      {/* HEADER (reutiliza las clases que ya tienes) */}
      <div className="app-header" role="banner">
        <div className="app-header-left">
          <span className="app-icon" aria-hidden="true"></span>

          <Link to="/" className="app-name">Archives</Link>

          <div className="search-wrapper" style={{ display: 'none' }}>
            <input className="search-input" type="text" placeholder="Find the book you like..." />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>

        <div className="app-header-right">
          <button
            className="mode-switch"
            title="Switch Theme"
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>

          <button className="add-btn" title="Add New">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <button className="notification-btn" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button className="profile-btn" title="Perfil">
            <img src="/68e45e7a40b25293eb1f3a85d9368ae0.png" alt="Profile" />
            <span>{user?.nombre}</span>
            <span style={{ marginLeft: 6 }}>{user?.apellidos}</span>
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <section id="sidebar">
        <a href="#" className="brand">
          <i className='bx bxs-smile'></i>
          
        </a>
        
        <ul className="side-menu top">
          {menuItems.map((item, index) => (
            <li key={index} className={activeMenuItem === index ? 'active' : ''}>
              <a
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleMenuItemClick(index); }}
              >
                {item.img && <img src={item.img} alt={item.text} className="menu-img" />}
                <i className={`bx ${item.icon}`}></i>
                <span className="text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
        
        <ul className="side-menu bottom">
          <li>
            <a href="#" className="logout" onClick={(e) => { e.preventDefault(); logout(); }}>
              <i className='bx bx-power-off'></i>
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>

      {/* CONTENT */}
      <section id="content" aria-main="true">
        {/* (Opcional) podías quitar el nav original con switch-mode porque lo tienes en el header */}
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Dashboard</h1>
            </div>
          </div>

          {/* Aquí mostramos la vista Admin o las tablas según la pestaña */}
          <div className="table-data">
            {activeMenuItem === 0 ? renderAdminView() : renderTablesOnly()}
          </div>
        </main>
      </section>

      {/* MODAL DE AÑADIR/MODIFICAR */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="modal-form">
            <h2>{isEditMode ? `Modificar ${currentTitulo}` : `Añadir ${currentTitulo}`}</h2>
            
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
                    <small style={{ display: 'block', color: '#888', fontSize: '12px', fontStyle: 'italic' }}>
                      * El username no se puede modificar (clave primaria)
                    </small>
                  )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  placeholder={isEditMode ? "" : "Ingresa la contraseña"} 
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

      {/* MODAL ELIMINAR */}
      <div className={`modal-overlay ${showDeleteModal ? 'active' : ''}`} onClick={handleCloseModal}>
        <div className="modal-content modal-delete" onClick={(e) => e.stopPropagation()}>
          <div className="delete-modal-content">
            <div className="delete-icon">
              <img src="/cruz.png" alt="Eliminar" />
            </div>
            <h2>¿Eliminar usuario?</h2>
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

      {/* MODAL ÉXITO */}
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
    


/* Subcomponentes (pegados tal cual) */
function TablaUsuarios({ titulo, datos, onAdd, onEdit, onDelete, refProp }) {
  return (
    <div className="order" ref={refProp}>
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
                    <button className="buttones" onClick={() => onEdit(usuario)}>Modificar</button>
                    <button className="buttones" onClick={() => onDelete(usuario)}>Eliminar</button>
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

function TablaClientes({ titulo, datos, refProp }) {
  return (
    <div className="order order-full-width" ref={refProp}>
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