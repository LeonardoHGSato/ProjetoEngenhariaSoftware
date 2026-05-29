package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioResponseDTO;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class FuncionarioService {
//    Declaracao do atributo
    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder;

//    O construtor aqui serve para fazer uma injecao de dependencias. Assim, o spring entrega um repository pronto ao invés de criar um com o new
    public FuncionarioService(FuncionarioRepository funcionarioRepository, PasswordEncoder passwordEncoder) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public FuncionarioResponseDTO cadastrarFuncionario(FuncionarioRequestDTO requestDTO){
        if(funcionarioRepository.existsByCpf(requestDTO.getCpf())){
            throw new RuntimeException("Cpf já cadastrado");
        }
        if(funcionarioRepository.existsByEmail(requestDTO.getEmail())){
            throw new RuntimeException("Email já cadastrado");
        }

//      Por conta da pré-definição do status e do perfil no FuncionarioModel, é necessário criar um objeto vazio
        FuncionarioModel funcionarioNovo = new FuncionarioModel();
//      Para depois inserir os elementos vindos do FuncionarioRequesDTO pelos setters.
        funcionarioNovo.setNome(requestDTO.getNome());
        funcionarioNovo.setEmail(requestDTO.getEmail());
        funcionarioNovo.setSenha(passwordEncoder.encode(requestDTO.getSenha()));
        funcionarioNovo.setNumeroTelefone(requestDTO.getNumeroTelefone());
        funcionarioNovo.setCpf(requestDTO.getCpf());

//        Por fim, o funcionário novo é salvo no banco de dados
        funcionarioRepository.save(funcionarioNovo);
//        Devolvemos para o front os dados do funcionario registrado
        FuncionarioResponseDTO responseDTO = new FuncionarioResponseDTO(funcionarioNovo.getNome(), funcionarioNovo.getEmail(), funcionarioNovo.getNumeroTelefone(), funcionarioNovo.getStatusFuncionario(), funcionarioNovo.getPerfilFuncionario());
        return responseDTO;
    }
}
