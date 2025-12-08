package seguridad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import seguridad.model.Perfil;

public interface PerfilRepository extends JpaRepository<Perfil, Integer> {
    Perfil findByNombre(String nombre);
}