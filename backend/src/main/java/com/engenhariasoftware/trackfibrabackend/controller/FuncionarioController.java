package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.service.FuncionarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/funcionarios")
public class FuncionarioController {

//    Declaracao do atributo para que o construtor seja válido
    private final FuncionarioService funcionarioService;

//    Construtor com injecao de dependencia (igual o construtor de funcionario service usa um FuncionarioRepository como parâmetro)
    public FuncionarioController(FuncionarioService funcionarioService){
        this.funcionarioService = funcionarioService;
    }

//    Annotation define que esse metodo responde requisições POST
    @PostMapping
//    RespondeEntity devolve uma resposta HTTP com um FuncionarioRespondeDTO (usa generics, ent tem que definir assim)
//    RequestBody faz o contrário, recebe o json e transforma em um FuncionarioRequestDTO
    public ResponseEntity<FuncionarioResponseDTO> cadastrarFuncionario(@RequestBody FuncionarioRequestDTO requestDTO){
//        Chamamos o Service, passando requestDTO
        FuncionarioResponseDTO responseDTO = funcionarioService.cadastrarFuncionario(requestDTO);
//        Devolvemos a resposta HTTP indicando que criamos o funcionario com sucesso (código 201 = CREATED)
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
//    Define que o metodo representa requisicoes GET
    @GetMapping
//    RequestParam apenas indica que recebemos os valores do frontend. Diferentemente do RequestBody usado no metodo do Post
    public ResponseEntity<Page<FuncionarioListagemDTO>> listarFuncionarios(
            @RequestParam(required = false) String nome, @RequestParam(required = false) StatusFuncionario status, Pageable pageable){

        return ResponseEntity.ok(funcionarioService.listarFuncionarios(nome, status, pageable));
    }
}