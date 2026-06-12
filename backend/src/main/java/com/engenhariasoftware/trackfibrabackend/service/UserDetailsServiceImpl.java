package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.config.BusinessException;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final FuncionarioRepository funcionarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        // Agora lança a RegraNegocioException se o e-mail não existir no banco
        return funcionarioRepository.findByEmail(username)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado com o e-mail: " + username));
    }
}