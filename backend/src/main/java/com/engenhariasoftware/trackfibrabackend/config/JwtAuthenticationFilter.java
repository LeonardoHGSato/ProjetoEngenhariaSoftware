package com.engenhariasoftware.trackfibrabackend.config;

import com.engenhariasoftware.trackfibrabackend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor // Cria o construtor automático para injetar as dependências
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Interface do Spring para buscar o usuário

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Pega o cabeçalho Authorization da requisição HTTP
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Valida se o cabeçalho existe e se começa com "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Deixa passar para o próximo filtro
            return;
        }

        // Extrai o token puro (pula os 7 caracteres de "Bearer ")
        jwt = authHeader.substring(7);

        // Extrai o e-mail usando o seu JwtService
        userEmail = jwtService.extrairEmail(jwt);

        // Se encontrou o e-mail e o usuário ainda não está autenticado no contexto atual
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Busca o usuário no banco de dados (retorna o seu FuncionarioModel)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            //Valida se o token é correto e bate com os dados do banco
            if (jwtService.tokenValido(jwt, userDetails)) {

                // Cria o objeto que diz ao Spring: "Esse usuário está autenticado e tem essas Roles"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities() // Passa as ROLES (SUPERVISOR/TECNICO)
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Salva a autenticação no contexto do Spring Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Continua o fluxo da requisição
        filterChain.doFilter(request, response);
    }
}