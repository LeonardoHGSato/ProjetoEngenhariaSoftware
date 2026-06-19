package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioEdicaoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.FuncionarioModel;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            throw new ConflitoException("Cpf já cadastrado");
        }
        if(funcionarioRepository.existsByEmail(requestDTO.getEmail())){
            throw new ConflitoException("Email já cadastrado");
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
        return toResponseDTO(funcionarioNovo);
    }

//    seleciona os objetos que condizem com os filtros de nome e status e retorna os dados deles
//    pageable cuida sozinho da paginacao (qual a pagina e o tamanho da lista de funcionarios exibidos por pagina)
    public Page<FuncionarioListagemDTO> listarFuncionarios(String nome, StatusFuncionario status, Pageable pageable){
        Specification<FuncionarioModel> filtros =
                FuncionarioSpecification.comNome(nome)
                .and(FuncionarioSpecification.comStatus(status));

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

    public FuncionarioResponseDTO buscarPorId(Long id){
        FuncionarioModel funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum funcionário cadastrado com esse id"));
        return toResponseDTO(funcionario);
    }

    @Transactional
//    Valida se o existe funcionario com aquele id e se ja existe alguem com o mesmo email. Depois, envia as alteracoes para o banco de dados
    public FuncionarioResponseDTO editarFuncionario(Long id, FuncionarioEdicaoDTO edicaoDTO){
        FuncionarioModel funcionarioAlterado = funcionarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum funcionário cadastrado com esse id"));

        if(funcionarioRepository.existsByEmailAndIdNot(edicaoDTO.getEmail(), id)){
            throw new ConflitoException("Já há outro funcionario cadastrado com esse email");
        }

//Altera os dados do funcionario
        funcionarioAlterado.setNome(edicaoDTO.getNome());
        funcionarioAlterado.setEmail(edicaoDTO.getEmail());
        funcionarioAlterado.setNumeroTelefone(edicaoDTO.getNumeroTelefone());
        funcionarioAlterado.setStatusFuncionario(edicaoDTO.getStatusFuncionario());
        funcionarioAlterado.setPerfilFuncionario(edicaoDTO.getPerfilFuncionario());
//        Altera os dados no banco de dados
        funcionarioRepository.save(funcionarioAlterado);
//Envia os dados alterados para o front
        return toResponseDTO(funcionarioAlterado);
    }

    @Transactional
//    Valida se existe funcionario com aquele id e faz o soft delete (altera status para INATIVO)
    public FuncionarioResponseDTO desativarFuncionario(Long id){
        if(!funcionarioRepository.existsById(id)){
            throw new RuntimeException("Não há nenhum funcionario cadastrado com esse id");
        }
//      Pega os dados do do funcionario e altera o status dele para INATIVO
        FuncionarioModel funcionarioDesativado = funcionarioRepository.findById(id).get();
        funcionarioDesativado.setStatusFuncionario(StatusFuncionario.INATIVO);
//      salva a alteracao no banco de dados
        funcionarioRepository.save(funcionarioDesativado);
//      retorna os dados do funcionario para o front
        return toResponseDTO(funcionarioDesativado);
    }

    private FuncionarioResponseDTO toResponseDTO(FuncionarioModel funcionarioModel){
        return new FuncionarioResponseDTO(
            funcionarioModel.getId(),
            funcionarioModel.getNome(),
            funcionarioModel.getEmail(),
            funcionarioModel.getNumeroTelefone(),
            funcionarioModel.getStatusFuncionario(),
            funcionarioModel.getPerfilFuncionario());
    }
}
