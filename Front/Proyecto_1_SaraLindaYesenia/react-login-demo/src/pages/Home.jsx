import './Home.css';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, User, ShoppingCart, Headphones } from 'lucide-react';
// Componente estar en pantalla
function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.3 } // empieza cuando el 30% del bloque es visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref]);

  return isIntersecting;
}

// Componente contador
function Contador({ final, visible }) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!visible) return; // no empieza hasta que sea visible

    let inicio = 0;
    const velocidad = 30; // ms entre incrementos
    const incremento = final / 100;

    const intervalo = setInterval(() => {
      inicio += incremento;
      if (inicio >= final) {
        clearInterval(intervalo);
        setValor(final);
      } else {
        setValor(Math.floor(inicio));
      }
    }, velocidad);

    return () => clearInterval(intervalo);
  }, [final, visible]);

  return <p className="numero-logro">{valor}</p>;
}


export default function Home() {

  // Generos
  useEffect(() => {
    // función del carrusel de géneros
    const track = document.getElementById("track");
    if (!track) return;
    const wrap = track.parentElement;
    const cards = Array.from(track.children);
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    const isMobile = () => matchMedia("(max-width:767px)").matches;

    let current = 0;

    function center(i) {
      const card = cards[i];
      const axis = isMobile() ? "top" : "left";
      const size = isMobile() ? "clientHeight" : "clientWidth";
      const start = isMobile() ? card.offsetTop : card.offsetLeft;
      wrap.scrollTo({
        [axis]: start - (wrap[size] / 2 - card[size] / 2),
        behavior: "smooth"
      });
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("active", k === i));
      prev.disabled = i === 0;
      next.disabled = i === cards.length - 1;
    }

    function activate(i, scroll) {
      if (i === current) return;
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }

    prev.onclick = () => go(-1);
    next.onclick = () => go(1);

    addEventListener("keydown", (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    });

    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && activate(i, true));
      card.addEventListener("click", () => activate(i, true));
    });

    let sx = 0, sy = 0;
    track.addEventListener("touchstart", (e) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
        go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }, { passive: true });

    addEventListener("resize", () => center(current));

    toggleUI(0);
    center(0);
  }, []);

  //Scroll
  const carruselResenasRef = useRef(null);
  const carruselLectorRef = useRef(null);
  const scrollLectorIzquierda = () => {
    carruselLectorRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollLectorDerecha = () => {
    carruselLectorRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollResenasIzquierda = () => {
    carruselResenasRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };
  const scrollResenasDerecha = () => {
    carruselResenasRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  {/*Botón de incrementar*/ }
  const [cantidad, setCantidad] = useState(1);

  const incrementarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  {/*Logros*/ }
  const logrosRef = useRef();
  const visible = useOnScreen(logrosRef);

  // CÓDIGO PARA OCULTAR/MOSTRAR NAVBAR AUTOMÁTICAMENTE
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si estás muy arriba, siempre muestra el nav
      if (currentScrollY < 100) {
        setIsVisible(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        setLastScrollY(currentScrollY);
        return;
      }

      // Si estás bajando, oculta el nav
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);

        // Después de 1 segundo sin scrollear, vuelve a mostrar
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
          setIsVisible(true);
        }, 1000); // Aparece después de 1 segundo
      }
      // Si subes, muestra el nav inmediatamente
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [lastScrollY]);

  return (

    <div className='home'>

      {/* Navegación */}
      <nav className={`barra-navegacion ${isVisible ? 'visible' : ''}`}>
        {/* Enlaces a la izquierda */}
        <div className="enlaces-navegacion">
          <Link to="/ficcion" className="enlace">Ficción y literatura <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/mejores-libros" className="enlace">Mejores libros <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/blogs" className="enlace">Blogs <span><svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
          </svg></span></Link>
          <Link to="/contacto" className="enlace">Contacto</Link>
        </div>

        {/* Título en el centro */}
        <div className="titulo-pagina">
          <Link>
            <h1>Archives</h1>
          </Link>
        </div>

        {/* Acciones a la derecha */}
        <div className="acciones-usuario">
          {/* Teléfono con cascos */}
          <div className="accion telefono">
            <Headphones size={22} className="icono-cascos" />
            <span className="texto-telefono">+34 900 123 456</span>
          </div>

          {/* Separador vertical */}
          <div className="separador"></div>

          {/* Login */}
          <Link to="/login" className="accion">
            <User size={24} />
          </Link>

          {/* Lupa */}
          <div className="accion">
            <Search size={22} className="icono-buscar" />
          </div>

          {/* Carrito */}
          <div className="accion">
            <ShoppingCart size={22} className="icono-carrito" />
          </div>
        </div>
      </nav>


      {/* Bloque de video */}
      <div className="bloque-video">
        <video className="video-fondo" autoPlay muted loop>
          <source src="/home-video-2.mp4" type="video/mp4" />
        </video>

        <div className="contenido-video">
          <h1 className="titulo-video">¡Descubre tu nueva lectura!</h1>
          <p className="subtitulo-video">Miles de títulos, autores, géneros para todos los gustos</p>

          <div className="buscador-contenedor">
            <Search className="buscador-logo" />
            <input
              type="text"
              placeholder="Buscar libros, autores..."
              className="buscador-input"
            />
          </div>
        </div>
      </div>

     {/* Sección géneros */}
      <div className="generos-bloque">
        <div className="cabecera">
          <h2 className="titulo-seccion">Para cada estado de ánimo</h2>
        </div>

        <div className="carrusel">
          <div className="pista" id="track">
            <article className="tarjeta" active>
              <img src="/tarjetaFondo1.jpg" alt="Fantasia1" className="tarjeta-fondo"/>
              <div className="tarjeta-contenido">
                  <h3 className="tarjeta-titulo">Fantasía</h3>
                  <p className="tarjeta-descripcion">Escápate a mundos imaginados.</p>
                  <button className="tarjeta-boton">Ver</button>
              </div>
            </article>

            <article className="tarjeta">
              <img src="/tarjetaFondo2.jpg" alt="Misterio1" className="tarjeta-fondo"/>
              <div className="tarjeta-contenido">
                  <h3 className="tarjeta-titulo">Misterio</h3>
                  <p className="tarjeta-descripcion">Historias que te mantienen en vilo.</p>
                  <button className="tarjeta-boton">Ver</button>
              </div>
            </article>

            <article className="tarjeta">
              <img src="/tarjetaFondo3.jpg" alt="Romance1" className="tarjeta-fondo"/>
              <div className="tarjeta-contenido">
                  <h3 className="tarjeta-titulo">Romance</h3>
                  <p className="tarjeta-descripcion">Lecturas para sentir y conectar.</p>
                  <button className="tarjeta-boton">Ver</button>
              </div>
            </article>

            <article className="tarjeta">
              <img src="/tarjetaFondo4.jpg" alt="Ciencia ficción 1" className="tarjeta-fondo"/>
              <div className="tarjeta-contenido">
                  <h3 className="tarjeta-titulo">Ciencia ficción</h3>
                  <p className="tarjeta-descripcion">Ideas que miran al futuro.</p>
                  <button className="tarjeta-boton">Ver</button>
              </div>
            </article>

            <article className="tarjeta">
              <img src="/tarjetaFondo5.jpg" alt="No ficción 1" className="tarjeta-fondo"/>
              <div className="tarjeta-contenido">
                  <h3 className="tarjeta-titulo">No ficción</h3>
                  <p className="tarjeta-descripcion">Aprende con historias reales.</p>
                  <button className="tarjeta-boton">Ver</button>
              </div>
            </article>
          </div>
        </div>

        <div className="controles">
          <button id="prev" className="btn-nav" aria-label="Anterior">
            <ChevronLeft size={20} /> 
          </button>
          <button id="next" className="btn-nav" aria-label="Siguiente"><ChevronRight size={20} /> </button>
        </div>
      </div>

      {/* Sección mejores libros vendidos */}
      <div className="seccion-mejores-libros">
        <h2 className="titulo-mejores">Los mejores libros vendidos</h2>

        <div className="contenedor-libros">
          {/* Columna 1 */}
          <div className="columna-libro">
            <img src="/mejorLibro1.jpg" alt="Libro 1" className="imagen-libro" />
            <h3 className="nombre-libro">El principito</h3>
            <button className="boton-comprar">Comprar ahora</button>
          </div>

          {/* Columna 2 */}
          <div className="columna-libro">
            <img src="/mejorLibro2.jpg" alt="Libro 2" className="imagen-libro" />
            <h3 className="nombre-libro">El arte de la guerra</h3>
            <button className="boton-comprar">Comprar ahora</button>
          </div>

          {/* Columna 3 */}
          <div className="columna-libro">
            <img src="/mejorLibro3.jpg" alt="Libro 3" className="imagen-libro" />
            <h3 className="nombre-libro">Harry Potter</h3>
            <button className="boton-comprar">Comprar ahora</button>
          </div>
        </div>
      </div>


      {/* Sección para el lector */}
      <div className="seccion-lector">
        <h2 className="titulo-lector">Para el lector</h2>

        <div className="carrusel-contenedor">
          {/* Flecha izquierda */}
          <button className="flecha-carrusel izquierda" onClick={scrollLectorIzquierda}>
            <ChevronLeft size={20} /> {/* flecha muy pequeña */}
          </button>

          {/* Carrusel */}
          <div className="carrusel-lector" ref={carruselLectorRef}>
            <div className="columna-lector">
              <img src="/lector1.jpg" alt="Libro recomendado 1" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Los juegos del hambre</h3>
              <p className="precio-libro">€14.99</p>
            </div>

            <div className="columna-lector">
              <img src="/lector2.jpg" alt="Libro recomendado 2" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Percy Jackson y los dioses del Olimpo</h3>
              <p className="precio-libro">€12.50</p>
            </div>

            <div className="columna-lector">
              <img src="/lector3.jpg" alt="Libro recomendado 3" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Invisible</h3>
              <p className="precio-libro">€16.90</p>
            </div>

            <div className="columna-lector">
              <img src="/lector4.jpg" alt="Libro recomendado 4" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Powerless</h3>
              <p className="precio-libro">€18.00</p>
            </div>

            <div className="columna-lector">
              <img src="/lector5.jpg" alt="Libro recomendado 5" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Bajo la misma estrella</h3>
              <p className="precio-libro">€15.75</p>
            </div>

            <div className="columna-lector">
              <img src="/lector6.jpg" alt="Libro recomendado 6" className="imagen-lector" />
              <h3 className="titulo-libro-lector">El diario de Greg</h3>
              <p className="precio-libro">€19.50</p>
            </div>

            <div className="columna-lector">
              <img src="/lector7.jpg" alt="Libro recomendado 7" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Las crónicas de narnia</h3>
              <p className="precio-libro">€19.50</p>
            </div>

            <div className="columna-lector">
              <img src="/lector8.jpg" alt="Libro recomendado 8" className="imagen-lector" />
              <h3 className="titulo-libro-lector">Don Quijote de la Mancha</h3>
              <p className="precio-libro">€19.50</p>
            </div>
          </div>

          {/* Flecha derecha */}
          <button className="flecha-carrusel derecha" onClick={scrollLectorDerecha}>
            <ChevronRight size={20} /> {/* flecha muy pequeña */}
          </button>
        </div>
      </div>

      {/* Sección reseñas */}
      <div className="seccion-resenas">
        <h2 className="titulo-resenas">Lo que dicen nuestros lectores</h2>

        <div className="carrusel-resenas">
          {/* Flecha izquierda */}
          <button className="flecha-resenas izquierda" onClick={scrollResenasIzquierda}>
            <ChevronLeft size={20} />
          </button>

          {/* Carrusel */}
          <div className="contenedor-resenas" ref={carruselResenasRef}>
            {/* Reseña 1 */}
            <div className="bloque-resena">
              <h3 className="titulo-libro-resena">El viaje interior</h3>
              <p className="subtitulo-libro-resena">por Clara Montes</p>
              <div className="estrellas-resena">★★★★★</div>
              <p className="texto-resena">
                “Este libro fue un cambio total para mí. Desde el primer capítulo, me sentí profundamente enganchado.”
              </p>
              <div className="info-lector-resena">
                <img src="/resena1.jpg" alt="Claudia Gar" className="imagen-lector-resena" />
                <div className="datos-lector-resena">
                  <p className="nombre-lector-resena">Claudia Gar</p>
                  <p className="ocupacion-lector-resena">Cliente y Colaborador</p>
                </div>
              </div>
            </div>

            {/* Reseña 2 */}
            <div className="bloque-resena">
              <h3 className="titulo-libro-resena">Horizontes lejanos</h3>
              <p className="subtitulo-libro-resena">por Miguel Ángel Ruiz</p>
              <div className="estrellas-resena">★★★★</div>
              <p className="texto-resena">
                “Como fanática de la ciencia ficción, he leído muchos libros, pero este realmente me transportó a otro mundo.”
              </p>
              <div className="info-lector-resena">
                <img src="/resena2.jpg" alt="Len Brooks" className="imagen-lector-resena" />
                <div className="datos-lector-resena">
                  <p className="nombre-lector-resena">Len Brooks</p>
                  <p className="ocupacion-lector-resena">Consultora de historias</p>
                </div>
              </div>
            </div>

            {/* Reseña 3 */}
            <div className="bloque-resena">
              <h3 className="titulo-libro-resena">Ecos del pasado</h3>
              <p className="subtitulo-libro-resena">por Laura Sánchez</p>
              <div className="estrellas-resena">★★★★★</div>
              <p className="texto-resena">
                “Como amante de la historia, siempre busco ficción bien investigada. Este libro me encantó especialmente.”
              </p>
              <div className="info-lector-resena">
                <img src="/resena3.jpg" alt="Owen Carter" className="imagen-lector-resena" />
                <div className="datos-lector-resena">
                  <p className="nombre-lector-resena">Owen Carter</p>
                  <p className="ocupacion-lector-resena">Editor</p>
                </div>
              </div>
            </div>

            {/* Reseña 4 */}
            <div className="bloque-resena">
              <h3 className="titulo-libro-resena">La caída</h3>
              <p className="subtitulo-libro-resena">por Albert Camus</p>
              <div className="estrellas-resena">★★★★★</div>
              <p className="texto-resena">
                “Me encantan las historias con personajes profundos, y aquí encontré protagonistas que se sienten reales.”
              </p>
              <div className="info-lector-resena">
                <img src="/resena4.jpg" alt="Miriam Delish" className="imagen-lector-resena" />
                <div className="datos-lector-resena">
                  <p className="nombre-lector-resena">Miriam Delish</p>
                  <p className="ocupacion-lector-resena">Colaborador</p>
                </div>
              </div>
            </div>

            {/* Reseña 5 */}
            <div className="bloque-resena">
              <h3 className="titulo-libro-resena">Latidos que nunca dije</h3>
              <p className="subtitulo-libro-resena">por Loren Jinx</p>
              <div className="estrellas-resena">★★★★★</div>
              <p className="texto-resena">
                “Como amante de la poesía, agradezco la belleza del lenguaje y la sensibilidad con la que está escrita.”
              </p>
              <div className="info-lector-resena">
                <img src="/resena5.jpg" alt="John Mark" className="imagen-lector-resena" />
                <div className="datos-lector-resena">
                  <p className="nombre-lector-resena">John Mark</p>
                  <p className="ocupacion-lector-resena">Creador de contenido</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flecha derecha */}
          <button className="flecha-resenas derecha" onClick={scrollResenasDerecha}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Sección libro del mes */}
      <div className="seccion-libro-mes">
        <h2 className="titulo-libro-mes">El libro del mes </h2>

        <div className="contenido-libro-mes">
          {/* Columna izquierda: imagen */}
          <div className="columna-imagen-libro">
            <img src="/libroDelMes.jpg" alt="Libro del mes" className="imagen-libro-mes" />
          </div>

          {/* Columna derecha: información */}
          <div className="columna-info-libro">
            <h3 className="nombre-libro-mes">Underwater </h3>
            <p className='autor'>By Serena Delmar</p>
            <span className="badge-descuento">AHORRA 11€</span>

            <div className="contenedor-precio">
              <span className="precio-libro-mes">21.00€</span>
              <span className="precio-original">30.00€</span>
            </div>

            <div className="acciones-libro">
              <div className="boton-cantidad">
                <button className="simbolo-cantidad" onClick={decrementarCantidad}>−</button>
                <span className="numero-cantidad">{cantidad}</span>
                <button className="simbolo-cantidad" onClick={incrementarCantidad}>+</button>
              </div>

              <button className="boton-carrito">AÑADIR AL CARRITO</button>
            </div>

            <button className="boton-comprar-ahora">COMPRAR AHORA</button>

            <p className="resumen-libro">
              «Bajo el agua», de Serena Delmar, te sumerge en el misterioso y fascinante mundo submarino. Este libro muestra la extraordinaria belleza de la vida marina y los paisajes submarinos, capturados por el lente de talentosos fotógrafos. Desde vibrantes arrecifes de coral hasta las misteriosas profundidades del océano, «Bajo el agua» ofrece una cautivadora exploración de las maravillas acuáticas del planeta.
            </p>
          </div>
        </div>
      </div>


      {/* Sección extractos */}
      <div className="seccion-extractos">
        <h2 className="titulo-extractos">Extractos</h2>

        <div className="contenedor-extractos">
          {/* Columna 1 */}
          <div className="columna-extracto">
            <img src="/extracto1.jpg" alt="Extracto libro 1" className="imagen-extracto" />
            <h3 className="titulo-libro-extracto">My America</h3>
            <p className="texto-extracto">"¿Qué significa vivir en un país donde las personas responsables de proteger a sus ciudadanos pueden verse tan a menudo implicadas en sus muertes?”</p>
            <p className="fecha-extracto">Publicado: 12/05/1955</p>
          </div>

          {/* Columna 2 */}
          <div className="columna-extracto">
            <img src="/extracto2.jpg" alt="Extracto libro 2" className="imagen-extracto" />
            <h3 className="titulo-libro-extracto">Ricardo Martín</h3>
            <p className="texto-extracto">Una saga familiar marcada por la magia y la historia.</p>
            <p className="fecha-extracto">Publicado: 20/07/2023</p>
          </div>

          {/* Columna 3 */}
          <div className="columna-extracto">
            <img src="/extracto3.jpg" alt="Extracto libro 3" className="imagen-extracto" />
            <h3 className="titulo-libro-extracto">El camino del despertar</h3>
            <p className="texto-extracto">"El deseo de alcanzar salud, prosperidad y felicidad requiere un cambio profundo en nuestra forma de ser, pues sin esa transformación interior es imposible lograr esas metas."</p>
            <p className="fecha-extracto">Publicado: 01/09/2023</p>
          </div>
        </div>
      </div>


      {/* Sección logros */}
      <div className="seccion-logros" ref={logrosRef}>
        <h2 className="titulo-logros">Logros</h2>

        <div className="contenedor-logros">
          <div className="columna-logro">
            <Contador final={20000} visible={visible} />
            <p className="texto-logro">Lectores</p>
          </div>
          <div className="columna-logro">
            <Contador final={15000} visible={visible} />
            <p className="texto-logro">Libros</p>
          </div>
          <div className="columna-logro">
            <Contador final={98} visible={visible} />
            <p className="texto-logro">Eventos y firmas</p>
          </div>
          <div className="columna-logro">
            <Contador final={25} visible={visible} />
            <p className="texto-logro">Premios ganados</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="contenedor-footer">
          {/* Columna 1 */}
          <div className="columna-footer">
            <h3 className="titulo-footer">Compañía</h3>
            <a href="/contacto" className="enlace-footer">Contáctanos</a>
            <a href="/tarjeta-regalo" className="enlace-footer">Tarjeta regalo</a>
            <a href="/blog" className="enlace-footer">Blog</a>
            <a href="/sostenibilidad" className="enlace-footer">Sostenibilidad</a>
          </div>

          {/* Columna 2 */}
          <div className="columna-footer">
            <h3 className="titulo-footer">Ayuda</h3>
            <a href="/faq" className="enlace-footer">Preguntas frecuentes</a>
            <a href="/envio" className="enlace-footer">Información de envío</a>
            <a href="/terminos" className="enlace-footer">Términos de servicio</a>
            <a href="/devoluciones" className="enlace-footer">Política de devolución</a>
          </div>

          {/* Columna 3 */}
          <div className="columna-footer">
            <h3 className="titulo-footer">Conectar</h3>
            <div className="logos-footer">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/instagram.jpg" alt="Instagram" />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                <img src="/tiktok.jpg" alt="Tiktok" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="/facebook.jpg" alt="Facebook" />
              </a>
              <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                <img src="/pinterest.jpg" alt="Pinterest" />
              </a>
            </div>
          </div>

          {/* Columna 4 */}
          <div className="columna-footer">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h1 className='logo-footer'>Archives</h1>
            </Link>
            <p>
              Descubre nuestra exquisita colección de libros, cuidadosamente seleccionada para ofrecer diversión y entretenimiento.
              Encuentra las obras perfectas para transformar tu tiempo libre en un oasis de imaginación y conocimiento.
            </p>
          </div>
        </div>

        {/* Pie de página final */}
        <div className="footer-final">
          <p className="texto-final-footer">
            © 2025 Archives - Todos los derechos reservados. Desarrollado por Sara, Linda y Yesenia.
          </p>
        </div>
      </footer>

    </div>
  );
}