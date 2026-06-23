package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.ChamadaRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ChamadaResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.exception.RecursoNaoEncontradoException;
import com.engenhariasoftware.trackfibrabackend.model.*;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ClienteRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import com.engenhariasoftware.trackfibrabackend.service.strategy.TipoChamadaStrategy;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChamadaService {

    private final ChamadaRepository chamadaRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final CarroRepository carroRepository;
    private final List<TipoChamadaStrategy> strategies;

    public ChamadaService(ChamadaRepository chamadaRepository, ClienteRepository clienteRepository, FuncionarioRepository funcionarioRepository, CarroRepository carroRepository, List<TipoChamadaStrategy> strategies) {
        this.chamadaRepository = chamadaRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.carroRepository = carroRepository;
        this.strategies = strategies;
    }

    @Transactional
    public ChamadaResponseDTO abrirChamada(ChamadaRequestDTO dto){
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado."));
        FuncionarioModel funcionario = funcionarioRepository.findById(dto.funcionarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Funcionário não encontrado."));
        Carro carro = carroRepository.findById(dto.carroId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Carro não encontrado."));

        if (!funcionario.isEnabled()) {
            throw new ConflitoException("O funcionário selecionado está inativo.");
        }
        if (carro.getStatus() != StatusCarro.DISPONIVEL) {
            throw new ConflitoException("O carro selecionado não está disponível no momento.");
        }

        LocalDateTime inicioJanela = dto.dataHora().minusHours(1);
        LocalDateTime fimJanela = dto.dataHora().plusHours(1);

        List<Chamada> conflitos = chamadaRepository.findByFuncionarioIdAndStatusAndDataHoraBetween(
                funcionario.getId(), StatusChamada.ABERTA, inicioJanela, fimJanela);

        if (!conflitos.isEmpty()) {
            throw new ConflitoException("O funcionário já possui uma chamada aberta neste horário.");
        }

        Endereco enderecoSnapshot;
        if (dto.endereco() != null) {
            enderecoSnapshot = dto.endereco().toEndereco();
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

        carro.setStatus(StatusCarro.EM_USO);
        carroRepository.save(carro);

        Chamada chamadaSalva = chamadaRepository.save(chamada);
        return new ChamadaResponseDTO(chamadaSalva);
    }
}
