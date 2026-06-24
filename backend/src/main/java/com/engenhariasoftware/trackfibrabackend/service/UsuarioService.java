package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.AlterarSenhaDTO;
import com.engenhariasoftware.trackfibrabackend.dto.UsuarioEdicaoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.UsuarioPerfilDTO;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(FuncionarioRepository funcionarioRepository, PasswordEncoder passwordEncoder) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioPerfilDTO buscarPerfil(FuncionarioModel usuarioLogado) {
        FuncionarioModel funcionario = funcionarioRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
        return new UsuarioPerfilDTO(funcionario);
    }

    @Transactional
    public UsuarioPerfilDTO editarPerfil(FuncionarioModel usuarioLogado, UsuarioEdicaoDTO dto) {
        FuncionarioModel funcionario = funcionarioRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        funcionario.setNome(dto.nome());
        funcionario.setNumeroTelefone(dto.telefone());

        return new UsuarioPerfilDTO(funcionarioRepository.save(funcionario));
    }

    @Transactional
    public void alterarSenha(FuncionarioModel usuarioLogado, AlterarSenhaDTO dto) {
        FuncionarioModel funcionario = funcionarioRepository.findById(usuarioLogado.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        if (!passwordEncoder.matches(dto.senhaAtual(), funcionario.getSenha())) {
            throw new ConflitoException("A senha atual informada está incorreta.");
        }

        funcionario.setSenha(passwordEncoder.encode(dto.novaSenha()));
        funcionarioRepository.save(funcionario);
    }
}
