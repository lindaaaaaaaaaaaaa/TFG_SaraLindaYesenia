package seguridad.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.model.Rol;
import seguridad.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String>{
	
	
	Usuario findByUsernameAndPassword(String username, String password);
	List<Usuario> findByPerfil_IdPerfil(int  idPerfil);

}
