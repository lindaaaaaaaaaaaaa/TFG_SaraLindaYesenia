import './Register.css';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '../api/api';
import { Headphones, User, Search, ShoppingCart } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Navbar visible/oculto al hacer scroll (igual que Login/Home) ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setIsVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        setLastScrollY(currentScrollY);
        return;
      }
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => setIsVisible(true), 1000);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [lastScrollY]);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Introduce un correo válido";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(name)) {
      newErrors.name = "El nombre solo puede contener letras y espacios";
    }

    if (!surname.trim()) {
      newErrors.surname = "Los apellidos son obligatorios";
    } else if (!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(surname)) {
      newErrors.surname = "Los apellidos solo pueden contener letras y espacios";
    }

    if (!birthdate.trim()) {
      newErrors.birthdate = "La fecha de nacimiento es obligatoria";
    } else if (new Date(birthdate) > new Date()) {
      newErrors.birthdate = "La fecha de nacimiento no puede ser mayor que la fecha actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await apiPost('/registro', {
        username: email,
        password,
        nombre: name,
        apellidos: surname,
        direccion: address,
        fechaNacimiento: birthdate,
        enabled: 1,
        perfil: { idPerfil: 2 }
      });
      setOk(true);
      setEmail("");
      setPassword("");
      setName("");
      setSurname("");
      setAddress("");
      setBirthdate("");
      setErrors({});
    } catch (err) {
      const mensaje = err.message || "Error al crear el usuario";
      alert(mensaje);
    }
  };

  return (
    <div className="pagina-registro">

      {/* --- NAVBAR --- */}
      <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
        <div className="enlaces-navegacion">
          <Link to="/ficcion" className="enlace">Ficción y literatura</Link>
          <Link to="/mejores-libros" className="enlace">Mejores libros</Link>
          <Link to="/blogs" className="enlace">Blogs</Link>
          <Link to="/contacto" className="enlace">Contacto</Link>
        </div>

        <div className="titulo-pagina">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>Archives</h1>
          </Link>
        </div>

        <div className="acciones-usuario">
          <div className="accion telefono">
            <Headphones size={22} className="icono-cascos" />
            <span className="texto-telefono">+34 900 123 456</span>
          </div>
          <div className="separador"></div>
          <Link to="/login" className="accion"><User size={24} /></Link>
          <div className="accion"><Search size={22} className="icono-buscar" /></div>
          <div className="accion"><ShoppingCart size={22} className="icono-carrito" /></div>
        </div>
      </nav>

      {/* --- FORMULARIO --- */}
      <div className="registro-contenedor">
        <form onSubmit={onSubmit}>
          <h2 className="titulo-registro">Registro</h2>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Correo electrónico *'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Contraseña *'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Nombre *'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              className="registro-input"
              placeholder='Apellidos *'
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            {errors.surname && <p className="error">{errors.surname}</p>}
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              placeholder='Dirección *'
              className="registro-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="registro-bloque">
            <label className="registro-label"></label>
            <input
              placeholder='Fecha de nacimiento *'
              className="registro-input"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
            {errors.birthdate && <p className="error">{errors.birthdate}</p>}
          </div>

          <p className="enlace-login">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>

          <button type='submit' className="registro-boton"><span>Crear cuenta</span></button>

          {ok && <p className="success">Usuario creado. ¡Ya puedes iniciar sesión!</p>}
        </form>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="contenedor-footer">
          <div className="columna-footer">
            <h3 className="titulo-footer">Compañía</h3>
            <Link to="/contacto" className="enlace-footer">Contáctanos</Link>
            <Link to="/tarjeta-regalo" className="enlace-footer">Tarjeta regalo</Link>
            <Link to="/blog" className="enlace-footer">Blog</Link>
            <Link to="/sostenibilidad" className="enlace-footer">Sostenibilidad</Link>
          </div>

          <div className="columna-footer">
            <h3 className="titulo-footer">Ayuda</h3>
            <Link to="/faq" className="enlace-footer">Preguntas frecuentes</Link>
            <Link to="/envio" className="enlace-footer">Información de envío</Link>
            <Link to="/terminos" className="enlace-footer">Términos de servicio</Link>
            <Link to="/devoluciones" className="enlace-footer">Política de devolución</Link>
          </div>

          <div className="columna-footer">
            <h3 className="titulo-footer">Conectar</h3>
            <div className="logos-footer">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><img src="/instagram.jpg" alt="Instagram" /></a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><img src="/tiktok.jpg" alt="Tiktok" /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><img src="/facebook.jpg" alt="Facebook" /></a>
              <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer"><img src="/pinterest.jpg" alt="Pinterest" /></a>
            </div>
          </div>

          <div className="columna-footer">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1 className="logo-footer">Archives</h1>
            </Link>
            <p>
              Descubre nuestra exquisita colección de libros, cuidadosamente seleccionada para ofrecer diversión y entretenimiento.
            </p>
          </div>
        </div>

        <div className="footer-final">
          <p className="texto-final-footer">
            © 2025 Archives - Todos los derechos reservados. Desarrollado por Sara, Linda y Yesenia.
          </p>
        </div>
      </footer>
    </div>
  );
}