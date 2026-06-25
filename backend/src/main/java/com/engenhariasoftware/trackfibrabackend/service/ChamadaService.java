package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.*;
import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.*;
import com.engenhariasoftware.trackfibrabackend.repository.*;
import com.engenhariasoftware.trackfibrabackend.service.strategy.TipoChamadaStrategy;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChamadaService {

    private final ChamadaRepository chamadaRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final CarroRepository carroRepository;
    private final ChamadaStatusLogRepository chamadaStatusLogRepository;
    private final List<TipoChamadaStrategy> strategies;

    public ChamadaService(ChamadaRepository chamadaRepository, ClienteRepository clienteRepository, FuncionarioRepository funcionarioRepository, CarroRepository carroRepository, ChamadaStatusLogRepository chamadaStatusLogRepository, List<TipoChamadaStrategy> strategies) {
        this.chamadaRepository = chamadaRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.carroRepository = carroRepository;
        this.chamadaStatusLogRepository = chamadaStatusLogRepository;
        this.strategies = strategies;
    }

    @Transactional
    public ChamadaResponseDTO abrirChamada(ChamadaRequestDTO dto){
        ClienteModel cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));
        FuncionarioModel funcionario = funcionarioRepository.findById(dto.funcionarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado."));
        Carro carro = carroRepository.findById(dto.carroId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Carro não encontrado."));

        if (!funcionario.isEnabled()) {
            throw new ConflitoException("O funcionário selecionado está inativo.");
        }
        if (carro.getStatus() == StatusCarro.MANUTENCAO || carro.getStatus() == StatusCarro.DESATIVADO) {
            throw new ConflitoException("O carro selecionado não está disponível no momento.");
        }

        LocalDateTime inicioJanela = dto.dataHora().minusHours(1);
        LocalDateTime fimJanela = dto.dataHora().plusHours(1);

        List<Chamada> conflitos = chamadaRepository.findByFuncionarioIdAndStatusAndDataHoraBetween(
                funcionario.getId(), StatusChamada.ABERTA, inicioJanela, fimJanela);

        if (!conflitos.isEmpty()) {
            throw new ConflitoException("O funcionário já possui uma chamada aberta neste horário.");
        }

        List<Chamada> conflitosCarro = chamadaRepository.findByCarroIdAndStatusAndDataHoraBetween(
                carro.getId(), StatusChamada.ABERTA, inicioJanela, fimJanela);

        if (!conflitosCarro.isEmpty()) {
            throw new ConflitoException("O carro já está alocado para outra chamada neste horário.");
        }

        Endereco enderecoSnapshot;
        if (dto.endereco() != null) {
            enderecoSnapshot = dto.endereco().toEndereco();
        } else if (cliente.getEndereco() == null) {
            throw new ConflitoException("O cliente não possui endereço cadastrado.");
        } else {
            enderecoSnapshot = new Endereco(
                    cliente.getEndereco().getCep(),
                    cliente.getEndereco().getRua(),
                    cliente.getEndereco().getNumero(),
                    cliente.getEndereco().getComplemento(),
                    cliente.getEndereco().getBairro(),
                    cliente.getEndereco().getCidade(),
                    cliente.getEndereco().getUf()
            );
        }

        Chamada chamada = new Chamada();
        chamada.setCliente(cliente);
        chamada.setFuncionario(funcionario);
        chamada.setCarro(carro);
        chamada.setTipoServico(dto.tipoServico());
        chamada.setDataHora(dto.dataHora());
        chamada.setEndereco(enderecoSnapshot);

        strategies.stream()
                .filter(strategy -> strategy.getTipoSuportado() == dto.tipoServico())
                .findFirst()
                .ifPresent(strategy -> strategy.executar(chamada));

        Chamada chamadaSalva = chamadaRepository.save(chamada);
        chamadaStatusLogRepository.save(new ChamadaStatusLog(chamadaSalva));
        return new ChamadaResponseDTO(chamadaSalva);
    }

    public ChamadaResponseDTO buscarPorId(Long id, FuncionarioModel usuarioLogado){
        Chamada chamada = chamadaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Chamada não encontrada."));

        if(usuarioLogado.getPerfilFuncionario() == PerfilFuncionario.TECNICO && !chamada.getFuncionario().getId().equals(usuarioLogado.getId())) {
            throw new AccessDeniedException("Acesso negado.");
        }

        return new ChamadaResponseDTO(chamada);
    }

    public Page<ChamadaListagemDTO> listarChamadas(
            StatusChamada status, TipoServico tipoServico, Long funcionarioId,
            LocalDateTime inicio, LocalDateTime fim,
            FuncionarioModel usuarioLogado, Pageable pageable) {

        Long filtroFuncionarioId = funcionarioId;
        int tamanhoPagina = 20;

        if (usuarioLogado.getPerfilFuncionario() == PerfilFuncionario.TECNICO) {
            filtroFuncionarioId = usuarioLogado.getId();
            tamanhoPagina = 10;
        }

        Pageable paginacaoComRegra = PageRequest.of(pageable.getPageNumber(), tamanhoPagina, pageable.getSort());

        Specification<Chamada> filtros = Specification.allOf(
                ChamadaSpecification.comStatus(status),
                ChamadaSpecification.comTipoServico(tipoServico),
                ChamadaSpecification.comFuncionario(filtroFuncionarioId),
                ChamadaSpecification.aPartirDe(inicio),
                ChamadaSpecification.ate(fim)
        );

        return chamadaRepository.findAll(filtros, paginacaoComRegra).map(ChamadaListagemDTO::new);
    }

    @Transactional
    public ChamadaResponseDTO finalizarChamada(Long id, ChamadaFinalizarDTO dto, FuncionarioModel usuarioLogado){
        Chamada chamada = chamadaRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Chamada não encontrada"));

        if(!chamada.getFuncionario().getId().equals(usuarioLogado.getId())){
            throw new AccessDeniedException("Acesso negado.");
        }

        if (chamada.getStatus() != StatusChamada.ABERTA){
            throw new ConflitoException("Apenas chamadas abertas podem ser finalizadas.");
        }
        strategies.stream().filter(strategy -> strategy.getTipoSuportado() == chamada.getTipoServico())
                .findFirst().ifPresent(strategy -> strategy.executarFinalizacao(chamada));

        chamada.setRelato(dto.relato());
        chamada.setStatus(StatusChamada.CONCLUIDA);

        Chamada chamadaSalva = chamadaRepository.save(chamada);
        chamadaStatusLogRepository.save(new ChamadaStatusLog(chamadaSalva));
        return new ChamadaResponseDTO(chamadaSalva);
    }

    @Transactional
    public ChamadaResponseDTO cancelarChamada(Long id, ChamadaCancelarDTO dto) {
        Chamada chamada = chamadaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Chamada não encontrada."));

        if (chamada.getStatus() == StatusChamada.CONCLUIDA) {
            throw new ConflitoException("Chamadas já concluídas não podem ser canceladas.");
        }

        if (chamada.getStatus() == StatusChamada.CANCELADA) {
            throw new ConflitoException("Esta chamada já foi cancelada.");
        }

        chamada.setStatus(StatusChamada.CANCELADA);
        chamada.setMotivoCancelamento(dto.motivo());

        Chamada chamadaSalva = chamadaRepository.save(chamada);
        chamadaStatusLogRepository.save(new ChamadaStatusLog(chamadaSalva));
        return new ChamadaResponseDTO(chamadaSalva);
    }

    public Page<ChamadaHistoricoDTO> historicoCliente(Long clienteId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable) {
        clienteRepository.findById(clienteId).orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));

        return chamadaRepository.findByClienteIdAndDataHoraBetween(clienteId, inicio, fim, pageable)
                .map(ChamadaHistoricoDTO::new);
    }

    public Page<ChamadaHistoricoDTO> historicoFuncionario(Long funcionarioId, LocalDateTime inicio, LocalDateTime fim, Pageable pageable) {
        funcionarioRepository.findById(funcionarioId).orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado."));

        return chamadaRepository.findByFuncionarioIdAndDataHoraBetween(funcionarioId, inicio, fim, pageable)
                .map(ChamadaHistoricoDTO::new);
    }
}
