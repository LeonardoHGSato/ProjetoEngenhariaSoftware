package com.engenhariasoftware.trackfibrabackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // Injeta automaticamente o seu filtro JWT por construtor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService; // Interface do Spring para buscar usuários

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desativa CSRF porque API REST com JWT não armazena estado em cookies
                .csrf(csrf -> csrf.disable())

                // 2. Configura as permissões de rota alinhadas com o backlog
                .authorizeHttpRequests(auth -> auth
                        // Rota de login pública para qualquer um tentar se autenticar
                        .requestMatchers("/api/v1/auth/login").permitAll()

                        // CRUD de Funcionários restrito a SUPERVISOR (Critério da Issue 3)
                        .requestMatchers("/api/v1/funcionarios/**").hasRole("SUPERVISOR")

                        // CRUD de Veículos restrito a SUPERVISOR
                        .requestMatchers("/api/v1/carros/**").hasRole("SUPERVISOR")

                        // Qualquer outra rota do sistema exigirá que o usuário esteja logado
                        .anyRequest().authenticated()
                )

                // 3. Define a sessão como STATELESS (sem estado no servidor)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Configura o provedor de autenticação customizado
                .authenticationProvider(authenticationProvider())

                // 5. Adiciona o seu filtro JWT na fila de execução, ANTES do filtro de usuário/senha padrão
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean responsável por unir o serviço de busca de usuário com o codificador de senhas
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Bean necessário para processar a autenticação no Controller de Login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}