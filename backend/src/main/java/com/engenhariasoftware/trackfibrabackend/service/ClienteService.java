package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.*;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCliente;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.Cliente;
import com.engenhariasoftware.trackfibrabackend.model.Endereco;
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

    public ClienteService(ClienteRepository clienteRepository, ViaCepService viaCepService){
        this.clienteRepository = clienteRepository;
        this.viaCepService = viaCepService;
    }

    public ClienteResponseDTO cadastrarCliente(ClienteRequestDTO requestDTO){
        String cpfCnpjLimpo = requestDTO.cpfCnpj().replaceAll("\\D", "");

        if (clienteRepository.existsByCpfCnpj(cpfCnpjLimpo)){
            throw new ConflitoException("CPF/CNJP já cadastrado.");
        }

        Endereco endereco = montarEnderecoValido(requestDTO.endereco());

        Cliente clienteNovo = new Cliente();
        clienteNovo.setNome(requestDTO.nome());
        clienteNovo.setCpfCnpj(cpfCnpjLimpo);
        clienteNovo.setTelefone(requestDTO.telefone());
        clienteNovo.setEmail(requestDTO.email());
        clienteNovo.setEndereco(endereco);

        clienteRepository.save(clienteNovo);
        return new ClienteResponseDTO(clienteNovo);
    }

    public Page<ClienteListagemDTO> listarClientes(String busca, Pageable pageable){
        Specification<Cliente> filtro = ClienteSpecification.comBusca(busca);
        Page<Cliente> clientes = clienteRepository.findAll(filtro, pageable);
        return clientes.map(ClienteListagemDTO::new);
    }

    public ClienteResponseDTO buscarPorId(Long id){
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id"));
        return new ClienteResponseDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO editarCliente(Long id, ClienteEdicaoDTO edicaoDTO){
// TODO: ao criar chamada, confirmar que ela usa uma cópia de Endereço e nao uma referencia ao Cliente/Endereço.

        Cliente clienteAlterado = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id."));

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
//        TODO: quando criar os chamados, validar se o cliente possuí chamados em aberto para lançar o ConflitoException

        Cliente clienteDesativado = clienteRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Não há nenhum cliente cadastrado com esse id."));

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
                enderecoViaCep.getBairo(),
                enderecoViaCep.getLogradouro(),
                enderecoViaCep.getUf()
        );
    }
}
