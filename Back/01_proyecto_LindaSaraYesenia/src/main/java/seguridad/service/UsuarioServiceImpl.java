package seguridad.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import seguridad.model.Perfil;
import seguridad.model.Rol;
import seguridad.model.Usuario;
import seguridad.repository.PerfilRepository;
import seguridad.repository.UsuarioRepository;
@Service
public class UsuarioServiceImpl implements UsuarioService, UserDetailsService{

@Autowired
private UsuarioRepository usuarioRepository;

@Autowired
    private PerfilRepository perfilRepository;



@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

/*return usuarioRepository.findById(username).orElse(null);*/
return usuarioRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
}

@Override
public Usuario findById(String username) {
return usuarioRepository.findById(username).orElse(null);
}

@Override
public Usuario findByUsernamePassword(String username, String password) {
// return usuarioRepository.findByUsernameAndPassword(username, password);
        Usuario usuario = usuarioRepository.findById(username).orElse(null);
        //si funciona username, y password hay que agregar con {noop} y comparar con sql
        if (usuario != null && usuario.getPassword().equals("{noop}" + password)) {
           return usuario;
        } else {
        return null;
        }
}

@Override
public List<Usuario> findAll() {
return usuarioRepository.findAll();
}

@Override
public Usuario registrarCliente(Usuario usuario) {

   if (usuarioRepository.existsById(usuario.getUsername())) {
       throw new RuntimeException("El usuario ya existe");
   }

   
   if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
       throw new RuntimeException("Password requerida");
   }
   //el service se asegura de añadir {noop} si hace falta
   String password = usuario.getPassword();
   if (!password.startsWith("{noop}")) {
       usuario.setPassword("{noop}" + password);
   } else {
       usuario.setPassword(password);
   }
   //dia registro siempre ser hoy
   usuario.setFechaRegistro(LocalDate.now());
   
   //direccion puede ser null
   if (usuario.getDireccion() == null)
    usuario.setDireccion("");

   // enabled por defecto si no viene; enabled puede ser actica(1) o no actica(2)
   if (usuario.getEnabled() == 0)
    usuario.setEnabled(1);

 
   if (usuario.getPerfil() == null || usuario.getPerfil().getIdPerfil() == 0) {
    // Si el frontend NO manda perfil -> asignar cliente (2) por defecto
       Perfil perfilCliente = perfilRepository.findById(2).orElseThrow(()
        -> new RuntimeException("El perfil cliente no existe"));
       usuario.setPerfil(perfilCliente);
   } else {
       // Si viene idPerfil -> buscar entidad; si funciona vuelve usuario, si no sale error con orElseThrow
       Integer idPerfil = usuario.getPerfil().getIdPerfil();
       Perfil perfilDB = perfilRepository.findById(idPerfil)
           .orElseThrow(() -> new RuntimeException("Perfil con ID " + idPerfil + " no existe"));
       usuario.setPerfil(perfilDB);
   }

   return usuarioRepository.save(usuario);
}


@Override
public List<Usuario> findByPerfil(int idPerfil) {
return usuarioRepository.findByPerfil_IdPerfil(idPerfil);
}

@Override
public int deleteById(String username) {
   // comprobamos existencia
   boolean exists = usuarioRepository.existsById(username);
   if (!exists) {
       return 0; //no elimina
   }
   usuarioRepository.deleteById(username);
   return 1; // exito, elimina
}

//Modificar
@Override
public Usuario updateUsuario(Usuario usuario) {
//
   Usuario existente = usuarioRepository.findById(usuario.getUsername())
           .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

   // Actualizar básicos
   if (usuario.getNombre() != null)
    existente.setNombre(usuario.getNombre());
   if (usuario.getApellidos() != null)
    existente.setApellidos(usuario.getApellidos());
   if (usuario.getDireccion() != null)
    existente.setDireccion(usuario.getDireccion());
   if (usuario.getFechaNacimiento() != null)
    existente.setFechaNacimiento(usuario.getFechaNacimiento());

   // Si viene password nueva, guardarla
   if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
       existente.setPassword(usuario.getPassword());
   }

   if (usuario.getFechaRegistro() != null)
       existente.setFechaRegistro(usuario.getFechaRegistro());
 
    try {
    existente.setEnabled(usuario.getEnabled());
} catch (Exception e) {

}

   if (usuario.getPerfil() != null && usuario.getPerfil().getIdPerfil() != 0) {
       Perfil perfilDB = perfilRepository.findById(usuario.getPerfil().getIdPerfil())
               .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
       existente.setPerfil(perfilDB);
   }

   return usuarioRepository.save(existente);
}


//para no sale doble vez {noop}
public String normalizePassword(String raw) {
   if (raw == null)
   
    return null;
   String cleaned = raw.replace("{noop}", "").trim();
   
   return "{noop}" + cleaned;
}

@Override
public Usuario saveUsuario(Usuario usuario) {
   if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
       usuario.setPassword(normalizePassword(usuario.getPassword()));
   }
   return usuarioRepository.save(usuario);
}

}
