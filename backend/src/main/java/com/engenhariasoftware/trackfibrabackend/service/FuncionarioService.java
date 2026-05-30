package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioSpecification;
import jdk.jshell.Snippet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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

//    seleciona os objetos que condizem com os filtros de nome e status e retorna os dados deles
//    pageable cuida sozinho da paginacao (qual a pagina e o tamanho da lista de funcionarios exibidos por pagina)
    public Page<FuncionarioListagemDTO> listarFuncionarios(String nome, StatusFuncionario status, Pageable pageable){
        Specification<FuncionarioModel> filtros =
                FuncionarioSpecification.comNome(nome)
                .and(FuncionarioSpecification.comSatatus(status));

//        Page e um objeto do Spring que contem os resultados e as informacoes de paginacao
        Page<FuncionarioModel> funcionarios = funcionarioRepository.findAll(filtros, pageable);

//        Transformamos cada elemento selecionado pelo filtro (funcionarios), percorrendo cada elemento atraves do lambda e transformando toda a colecao em objetos DTO
        return funcionarios.map(funcionario -> new FuncionarioListagemDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getEmail(),
                funcionario.getNumeroTelefone(),
                funcionario.getStatusFuncionario()
        ));
    }
}
