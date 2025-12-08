package seguridad.security;

import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    @Bean //cors -> Define las reglas de cors
    public CorsConfigurationSource corsConfigurationSource() {
   
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); //Seguridad -> que permite enviar cookies y headers entre front y back
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); //todos los method se puede usar
       
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        // /** -> todas las rutas en controller; para todas las rutas permite 5137
        // vuelve a spring
        return source;
        /* Esquema  de cors
          传入请求: GET /api/usuarios
          ↓
Spring Security 询问: "/api/usuarios 有什么 CORS 规则?"
        ↓
UrlBasedCorsConfigurationSource 查找: "/** 匹配 /api/usuarios"
        ↓
返回: config (允许 localhost:5173,所有方法等)
        ↓
Spring Security 应用这些规则
          */
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authProvider) throws Exception {
        http
        .csrf(csrf -> csrf.disable())
        .cors(Customizer.withDefaults()) //activa cors
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
       
        .authorizeHttpRequests(auth -> auth
       
        // navegador pregunta a back options, y options con permitAll
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
           
            // las rutas no necesita verificar
            .requestMatchers("/api/login", "/registro", "/todos", "/actuator/health").permitAll()
           
            //las rutas hay que verificar
            //Crear usuario -> admin y jefe se permite crear usaurio
            .requestMatchers("/admin/crear").hasAnyRole("ADMON","JEFE")
           
            //las rutas de rol que requiere autenticacion
            .requestMatchers("/rol/**").authenticated()
            .anyRequest().authenticated()
        )

        .httpBasic(httpBasic -> httpBasic.disable())

        .formLogin(form -> form.disable())

        .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));


    return http.build();
    }
   
    //Verificar username y password si esta bien -> buscar en sql
    @Bean
    AuthenticationProvider authenticationProvider(UserDetailsService uds) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        return provider;
    }
    @Bean
    // necesita AuthenticationProvider
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}