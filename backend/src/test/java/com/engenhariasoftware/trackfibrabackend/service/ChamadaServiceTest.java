package com.engenhariasoftware.trackfibrabackend.service;

import com.engenhariasoftware.trackfibrabackend.dto.ChamadaFinalizarDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ChamadaRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.ChamadaResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import com.engenhariasoftware.trackfibrabackend.enums.StatusChamada;
import com.engenhariasoftware.trackfibrabackend.enums.TipoServico;
import com.engenhariasoftware.trackfibrabackend.exception.ConflitoException;
import com.engenhariasoftware.trackfibrabackend.model.*;
import com.engenhariasoftware.trackfibrabackend.repository.CarroRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ChamadaRepository;
import com.engenhariasoftware.trackfibrabackend.repository.ClienteRepository;
import com.engenhariasoftware.trackfibrabackend.repository.FuncionarioRepository;
import com.engenhariasoftware.trackfibrabackend.service.strategy.TipoChamadaStrategy;
import org.springframework.security.access.AccessDeniedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChamadaServiceTest {

    @Mock
    private ChamadaRepository chamadaRepository;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private FuncionarioRepository funcionarioRepository;
    @Mock
    private CarroRepository carroRepository;
    @Mock
    private TipoChamadaStrategy strategyMock;

    // Essa linha cria o Service de verdade, mas injeta os repositórios "falsos" (Mocks) criados acima.
    // Assim conseguimos testar o Service sem depender de um banco de dados real.
    @InjectMocks
    private ChamadaService chamadaService;

    // Variáveis que vamos usar em todos os testes
    private ClienteModel cliente;
    private FuncionarioModel funcionario;
    private Carro carro;
    private ChamadaRequestDTO requestDTO;
    private Chamada chamada;

    @BeforeEach
    void setup() {
        // Prepara os dados falsos antes de cada teste rodar
        cliente = new ClienteModel();
        cliente.setId(1L);
        cliente.setNome("João Silva");
        cliente.setEndereco(new Endereco("12345678", "Rua A", "10", null, "Centro", "Cidade", "PR"));

        funcionario = new FuncionarioModel();
        funcionario.setId(1L);
        funcionario.setNome("Técnico Guilherme");

        carro = new Carro();
        carro.setId(1L);
        carro.setPlaca("ABC1234");
        carro.setStatus(StatusCarro.DISPONIVEL);

        requestDTO = new ChamadaRequestDTO(
                1L, 1L, 1L, TipoServico.INSTALACAO, LocalDateTime.now().plusDays(1), null
        );

        // Como o Service espera uma lista de strategies, nós simulamos isso aqui no construtor
        chamadaService = new ChamadaService(
                chamadaRepository, clienteRepository, funcionarioRepository, carroRepository, List.of(strategyMock)
        );

        chamada = new Chamada();
        chamada.setId(10L);
        chamada.setCliente(cliente);
        chamada.setFuncionario(funcionario);
        chamada.setCarro(carro);
        chamada.setTipoServico(TipoServico.INSTALACAO);
        chamada.setStatus(StatusChamada.ABERTA);
    }

    @Test
    @DisplayName("Deve abrir chamada com sucesso quando todos os dados são válidos")
    void deveAbrirChamadaComSucesso() {
        // Prepara o cenário: ensina os Mocks o que eles devem responder
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(funcionario));
        when(carroRepository.findById(1L)).thenReturn(Optional.of(carro));
        when(chamadaRepository.findByFuncionarioIdAndStatusAndDataHoraBetween(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList()); // Retorna lista vazia (sem conflitos)

        when(strategyMock.getTipoSuportado()).thenReturn(TipoServico.INSTALACAO);

        Chamada chamadaSalva = new Chamada();
        chamadaSalva.setId(100L);
        chamadaSalva.setCliente(cliente);
        chamadaSalva.setFuncionario(funcionario);
        chamadaSalva.setCarro(carro);
        chamadaSalva.setDataHora(requestDTO.dataHora());
        chamadaSalva.setTipoServico(requestDTO.tipoServico());
        chamadaSalva.setStatus(StatusChamada.ABERTA);

        when(chamadaRepository.save(any(Chamada.class))).thenReturn(chamadaSalva);

        ChamadaResponseDTO response = chamadaService.abrirChamada(requestDTO);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals(StatusCarro.EM_USO, carro.getStatus()); // Verifica a atualização atômica
        verify(strategyMock, times(1)).executar(any()); // Verifica se o Strategy foi chamado
    }

    @Test
    @DisplayName("Deve falhar quando funcionário já possui chamada no mesmo horário (conflito)")
    void deveFalharQuandoFuncionarioTemConflito() {
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(funcionario));
        when(carroRepository.findById(1L)).thenReturn(Optional.of(carro));

        // Simula que o banco achou uma chamada na janela de 1h
        when(chamadaRepository.findByFuncionarioIdAndStatusAndDataHoraBetween(any(), any(), any(), any()))
                .thenReturn(List.of(new Chamada()));

        ConflitoException exception = assertThrows(ConflitoException.class, () -> {
            chamadaService.abrirChamada(requestDTO);
        });

        assertTrue(exception.getMessage().contains("horário"));
        verify(chamadaRepository, never()).save(any()); // Garante que a chamada não foi salva
    }

    @Test
    @DisplayName("Deve falhar quando carro selecionado não está disponível")
    void deveFalharQuandoCarroIndisponivel() {
        carro.setStatus(StatusCarro.EM_USO); // Força o erro

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(funcionario));
        when(carroRepository.findById(1L)).thenReturn(Optional.of(carro));

        ConflitoException exception = assertThrows(ConflitoException.class, () -> {
            chamadaService.abrirChamada(requestDTO);
        });

        assertTrue(exception.getMessage().contains("disponível"));
        verify(chamadaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve delegar validação para strategy correspondente ao tipo de serviço")
    void deveDelegarValidacaoAStrategy() {

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(funcionario));
        when(carroRepository.findById(1L)).thenReturn(Optional.of(carro));
        when(chamadaRepository.findByFuncionarioIdAndStatusAndDataHoraBetween(any(), any(), any(), any()))
                .thenReturn(Collections.emptyList());

        when(strategyMock.getTipoSuportado()).thenReturn(TipoServico.INSTALACAO);
        when(chamadaRepository.save(any(Chamada.class))).thenAnswer(invocation -> invocation.getArgument(0));

        chamadaService.abrirChamada(requestDTO);

        verify(strategyMock, times(1)).executar(any(Chamada.class));
    }

    @Test
    @DisplayName("Deve finalizar chamada com sucesso")
    void deveFinalizarComSucesso() {
        ChamadaFinalizarDTO dto = new ChamadaFinalizarDTO("Serviço realizado com sucesso.", LocalDateTime.now());

        when(chamadaRepository.findById(10L)).thenReturn(Optional.of(chamada));
        when(strategyMock.getTipoSuportado()).thenReturn(TipoServico.INSTALACAO);
        when(chamadaRepository.save(any(Chamada.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ChamadaResponseDTO response = chamadaService.finalizarChamada(10L, dto, funcionario);

        assertEquals(StatusChamada.CONCLUIDA, chamada.getStatus());
        assertEquals("Serviço realizado com sucesso.", chamada.getRelato());
        assertNotNull(response);
    }

    @Test
    @DisplayName("Deve lançar 403 quando funcionário não é o atribuído à chamada")
    void deveLancar403OutroFuncionario() {
        FuncionarioModel outroFuncionario = new FuncionarioModel();
        outroFuncionario.setId(99L);

        ChamadaFinalizarDTO dto = new ChamadaFinalizarDTO("Relato qualquer aqui.", LocalDateTime.now());

        when(chamadaRepository.findById(10L)).thenReturn(Optional.of(chamada));

        assertThrows(AccessDeniedException.class, () -> {
            chamadaService.finalizarChamada(10L, dto, outroFuncionario);
        });

        verify(chamadaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar 409 quando chamada já está concluída")
    void deveLancar409JaConcluida() {
        chamada.setStatus(StatusChamada.CONCLUIDA);
        ChamadaFinalizarDTO dto = new ChamadaFinalizarDTO("Relato qualquer aqui.", LocalDateTime.now());

        when(chamadaRepository.findById(10L)).thenReturn(Optional.of(chamada));

        assertThrows(ConflitoException.class, () -> {
            chamadaService.finalizarChamada(10L, dto, funcionario);
        });

        verify(chamadaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve liberar o carro após finalizar a chamada")
    void deveLiberarCarroAposFinalizar() {
        carro.setStatus(StatusCarro.EM_USO);
        ChamadaFinalizarDTO dto = new ChamadaFinalizarDTO("Serviço realizado com sucesso.", LocalDateTime.now());

        when(chamadaRepository.findById(10L)).thenReturn(Optional.of(chamada));
        when(strategyMock.getTipoSuportado()).thenReturn(TipoServico.INSTALACAO);
        when(chamadaRepository.save(any(Chamada.class))).thenAnswer(invocation -> invocation.getArgument(0));

        chamadaService.finalizarChamada(10L, dto, funcionario);

        assertEquals(StatusCarro.DISPONIVEL, carro.getStatus());
        verify(carroRepository, times(1)).save(carro);
    }

    @Test
    @DisplayName("Deve delegar finalização à strategy correspondente ao tipo de serviço")
    void deveDelegarFinalizacaoAStrategy() {
        ChamadaFinalizarDTO dto = new ChamadaFinalizarDTO("Serviço realizado com sucesso.", LocalDateTime.now());

        when(chamadaRepository.findById(10L)).thenReturn(Optional.of(chamada));
        when(strategyMock.getTipoSuportado()).thenReturn(TipoServico.INSTALACAO);
        when(chamadaRepository.save(any(Chamada.class))).thenAnswer(invocation -> invocation.getArgument(0));

        chamadaService.finalizarChamada(10L, dto, funcionario);

        verify(strategyMock, times(1)).executarFinalizacao(chamada);
    }
}

