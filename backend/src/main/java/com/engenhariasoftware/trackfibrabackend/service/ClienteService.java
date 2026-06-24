package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.*;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCliente;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.ClienteModel;
import com.engenhariasoftware.trackfibrabackend.model.Endereco;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ClienteRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ClienteSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ViaCepService viaCepService;
    private final ChamadaRepository chamadaRepository;

    public ClienteService(ClienteRepository clienteRepository, ViaCepService viaCepService, ChamadaRepository chamadaRepository){
        this.clienteRepository = clienteRepository;
        this.viaCepService = viaCepService;
        this.chamadaRepository = chamadaRepository;
    }

    public ClienteResponseDTO cadastrarCliente(ClienteRequestDTO requestDTO){
        String cpfCnpjLimpo = requestDTO.cpfCnpj().replaceAll("\\D", "");

        if (clienteRepository.existsByCpfCnpj(cpfCnpjLimpo)){
            throw new ConflitoException("CPF/CNJP já cadastrado.");
        }

        Endereco endereco = montarEnderecoValido(requestDTO.endereco());

        ClienteModel clienteNovo = new ClienteModel();
        clienteNovo.setNome(requestDTO.nome());
        clienteNovo.setCpfCnpj(cpfCnpjLimpo);
        clienteNovo.setTelefone(requestDTO.telefone());
        clienteNovo.setEmail(requestDTO.email());
        clienteNovo.setEndereco(endereco);

        clienteRepository.save(clienteNovo);
        return new ClienteResponseDTO(clienteNovo);
    }

    public Page<ClienteListagemDTO> listarClientes(String busca, Pageable pageable){
        Specification<ClienteModel> filtro = Specification.allOf(ClienteSpecification.comBusca(busca),
                (root, query, cb) -> cb.equal(root.get("status"), StatusCliente.ATIVO));
        Page<ClienteModel> clientes = clienteRepository.findAll(filtro, pageable);
        return clientes.map(ClienteListagemDTO::new);
    }

    public ClienteResponseDTO buscarPorId(Long id){
        ClienteModel cliente = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id"));
        return new ClienteResponseDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO editarCliente(Long id, ClienteEdicaoDTO edicaoDTO){

        ClienteModel clienteAlterado = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id."));

        Endereco endereco = montarEnderecoValido(edicaoDTO.endereco());
        clienteAlterado.setNome(edicaoDTO.nome());
        clienteAlterado.setTelefone(edicaoDTO.telefone());
        clienteAlterado.setEmail(edicaoDTO.email());
        clienteAlterado.setEndereco(endereco);

        clienteRepository.save(clienteAlterado);
        return new ClienteResponseDTO(clienteAlterado);
    }

    @Transactional
    public ClienteResponseDTO desativarCliente(Long id){
        ClienteModel clienteDesativado = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id."));

        if (chamadaRepository.existsByClienteIdAndStatus(id, StatusChamada.ABERTA)) {
            throw new ConflitoException("Não é possível remover um cliente com chamada em aberto.");
        }

        clienteDesativado.setStatus(StatusCliente.INATIVO);
        clienteRepository.save(clienteDesativado);
        return new ClienteResponseDTO(clienteDesativado);
        }

    private Endereco montarEnderecoValido(EnderecoDTO enderecoDTO){
        ViaCepResponseDTO enderecoViaCep = viaCepService.buscarEnderecoPorCep(enderecoDTO.cep());

        return new Endereco(
                enderecoDTO.cep().replaceAll("\\D", ""),
                enderecoViaCep.getLogradouro(),
                enderecoDTO.numero(),
                enderecoDTO.complemento(),
                enderecoViaCep.getBairro(),
                enderecoViaCep.getLocalidade(),
                enderecoViaCep.getUf()
        );
    }
}
