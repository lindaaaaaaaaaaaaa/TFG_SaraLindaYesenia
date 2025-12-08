package seguridad.restcontroller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import seguridad.model.Perfil;
import seguridad.model.Usuario;
import seguridad.repository.PerfilRepository;
import seguridad.service.UsuarioService;

@RestController
@CrossOrigin(origins = "*")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;
   
    @Autowired
    private PerfilRepository perfilRepository;
   
    @Autowired
    private AuthenticationManager authenticationManager;

   
    // Mostrar todos los usuarios
    @GetMapping("/todos")
    public ResponseEntity<?> todos() {
        List<Usuario> lista = usuarioService.findAll();
        //para mas seguro de contraseña, que muestra "null"
        lista.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(lista);
    }
   
   

    // Login
    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario, HttpServletRequest request) {
        try {//compara la contraseña y usuario en sql
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usuario.getUsername(), usuario.getPassword())
            );
           
            //funciona; verificar automaticamente
            SecurityContextHolder.getContext().setAuthentication(auth);
           
            //servidor guarda para recordar; y nevegador envia cookie
            //Tipo con security
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            // si esta bien, vuelve a front pero no con password
            Usuario user = usuarioService.findById(usuario.getUsername());
            if (user != null) user.setPassword(null);{
            //mandar a front
            return ResponseEntity.ok(user);
            }
        } catch (Exception e) { //no funciona
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

   
   
    // Registro
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioService.registrarCliente(usuario);
            nuevo.setPassword(null);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar");
        }
    }

   
   
    // Usuarios por rol
    @GetMapping("/rol/{rol}")
    public ResponseEntity<?> porRol(@PathVariable int rol, Authentication auth) {
    // primero hay que loguear, si no, sale error 401
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }
       
        // ya esta logueado bien
        Usuario actual = (Usuario) auth.getPrincipal();
        // saca idPerfil == Rol de usuario
        int miRol = actual.getPerfil().getIdPerfil();
       
        // son los permisos
        boolean permitido = false;
        // 1 -> para todo
        if (miRol == 1) {          
            permitido = true;
            //4 -> para los de mas per sin 1
        } else if (miRol == 4) {      
            if (rol == 4 || rol == 3 || rol == 2)
            permitido = true;
            //3 -> para 3 y 2
        } else if (miRol == 3) {    
            if (rol == 3 || rol == 2)
            permitido = true;
            //2 -> solo su propio
        } else if (miRol == 2) {    
            if (rol == 2)
            permitido = true;
        }
        if (!permitido) {
            return ResponseEntity.status(403).body("No tienes permisos");
        }

        //Busacar usuario con este rol
        List<Usuario> lista = usuarioService.findByPerfil(rol);
        lista.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(lista);
    }
   
   

    //Modificar: Admin -> Jefe y Trabajador; Jefe -> Trabajador
    @PutMapping("/usuario/{username}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable String username, @RequestBody Usuario dto, Authentication auth) {
    // primero hay que loguear, si no, sale error 401
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        //buscar datos de este usuario
        Usuario actual = (Usuario) auth.getPrincipal();
        //buscar por username
        Usuario objetivo = usuarioService.findById(username);
       
        if (objetivo == null) {
        return ResponseEntity.notFound().build();
        }
        // usuario logueado
        int rolActual = actual.getPerfil().getIdPerfil();
        // usuario quiere modificar
        int rolObjetivo = objetivo.getPerfil().getIdPerfil();

        boolean isAdmin = (rolActual == 1);// para ver usuario logueado si es admin
        boolean isJefe = (rolActual == 4);// para ver usuario logueado si es jefe
        //boolean isSelf = actual.getUsername().equals(username); // comparar si los dos son mismo rol, es decir si se puede modificar los datos de propio

        //if (isSelf) permitido = true;
        boolean permitido = false;

       


        if (!permitido && isAdmin) {
            if (rolObjetivo == 4 || rolObjetivo == 3)
            permitido = true;
        }

        if (!permitido && isJefe) {
            if (rolObjetivo == 3)
            permitido = true;
        }

        if (!permitido) {
            return ResponseEntity.status(403)
                    .body("No tienes permisos para modificar a este usuario");
        }
        //solo para propio
      /*  if (isSelf) {

            if (dto.getUsername() != null) objetivo.setUsername(dto.getUsername());
            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {

            String sanitized = usuarioService.normalizePassword(dto.getPassword());
            objetivo.setPassword(sanitized);
            }
            if (dto.getNombre() != null) objetivo.setNombre(dto.getNombre());
            if (dto.getApellidos() != null) objetivo.setApellidos(dto.getApellidos());
            if (dto.getFechaNacimiento() != null) objetivo.setFechaNacimiento(dto.getFechaNacimiento());
            if (dto.getDireccion() != null) objetivo.setDireccion(dto.getDireccion());

        }*/


       

            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String sanitized = usuarioService.normalizePassword(dto.getPassword());
            objetivo.setPassword(sanitized);
            }
           
            if (dto.getNombre() != null) objetivo.setNombre(dto.getNombre());
            if (dto.getApellidos() != null) objetivo.setApellidos(dto.getApellidos());
            if (dto.getFechaNacimiento() != null) objetivo.setFechaNacimiento(dto.getFechaNacimiento());
            if (dto.getDireccion() != null) objetivo.setDireccion(dto.getDireccion());


            if (dto.getPerfil() != null && dto.getPerfil().getIdPerfil() != 0) {
                Perfil perfilDB = perfilRepository.findById(dto.getPerfil().getIdPerfil())
                        .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
                    objetivo.setPerfil(perfilDB);
            }


            int en = dto.getEnabled();
            if (en == 2 || en == 1) {
                objetivo.setEnabled(en);
            }
       

        Usuario actualizado = usuarioService.updateUsuario(objetivo);
        actualizado.setPassword(null);

        return ResponseEntity.ok(actualizado);
    }
   
   
   
   
    //Eliminar: Admin -> Jefe y Trabajador; Jefe -> Trabajador
    @DeleteMapping("/usuario/{username}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable String username, Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }
        Usuario actual = (Usuario) auth.getPrincipal();

       
        if (actual.getUsername().equals(username)) {
            return ResponseEntity.status(400).body("No puedes eliminarte a ti mismo");
        }

        //buscar en sql
        Usuario objetivo = usuarioService.findById(username);
       
        if (objetivo == null) {
            return ResponseEntity.status(404).body("Usuario no encontrado");
        }

        int rolActual = actual.getPerfil().getIdPerfil();
        int rolObjetivo = objetivo.getPerfil().getIdPerfil();

        boolean isAdmin = (rolActual == 1);
        boolean isJefe  = (rolActual == 4);

        boolean permitido = false;


        if (isAdmin) {
            if (rolObjetivo == 4 || rolObjetivo == 3)
            permitido = true;
        }


        if (!permitido && isJefe) {
            if (rolObjetivo == 3)
            permitido = true;
        }

        if (!permitido) {
            return ResponseEntity.status(403).body("No tienes permisos para eliminar a este usuario");
        }
        // unir con sql
        try {
            int filas = usuarioService.deleteById(username);
            if (filas == 0) {
            return ResponseEntity.status(404).body("Usuario no encontrado (no eliminado)");
            }else
            //envia a front un json
            return ResponseEntity.ok(Map.of("msg", "Eliminado"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar", "message", e.getMessage()));
        }
    }
   
   
   
   
   
   
  // Añadir Jefe y Trabajador
    @PostMapping("/admin/crear")
    public ResponseEntity<?> crearUsuarioAdmin(@RequestBody Usuario dto, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("No autenticado");
        }

        Usuario actual = (Usuario) auth.getPrincipal();
       
       
        if (actual.getPerfil().getIdPerfil() != 1 && actual.getPerfil().getIdPerfil() != 4) {
            return ResponseEntity.status(403).body("Solo admin puede crear usuarios");
        }

       
        Integer idPerfilNuevo = dto.getPerfil() != null ? dto.getPerfil().getIdPerfil() : null;
        if (idPerfilNuevo == null || (idPerfilNuevo != 3 && idPerfilNuevo != 4)) {
            return ResponseEntity.status(400).body("Solo se pueden crear TRABAJADORES (3) o JEFES (4)");
        }else if (actual.getPerfil().getIdPerfil() == 4) {

            if (idPerfilNuevo == null || idPerfilNuevo != 3) {
                return ResponseEntity.status(400).body("Los jefes solo pueden crear TRABAJADORES (3)");
            }
        }

        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username requerido");
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password requerida");
        }

        dto.setFechaRegistro(LocalDate.now());

        if (dto.getEnabled() == 0) dto.setEnabled(1);


        try {

            Usuario creado = usuarioService.registrarCliente(dto);
            creado.setPassword(null);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al crear usuario: " + e.getMessage());
        }
    }

}