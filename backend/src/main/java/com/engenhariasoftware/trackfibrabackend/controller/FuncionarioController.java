package com.engenhariasoftware.trackfibrabackend.controller;

import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioEdicaoDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioListagemDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioRequestDTO;
import com.engenhariasoftware.trackfibrabackend.dto.FuncionarioResponseDTO;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import com.engenhariasoftware.trackfibrabackend.service.FuncionarioService;
import jakarta.validation.Valid;
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
    public ResponseEntity<FuncionarioResponseDTO> cadastrarFuncionario(@RequestBody @Valid FuncionarioRequestDTO requestDTO){
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

//    Novo endopoint GET para listar as informações de um funcionário individual
    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponseDTO> buscarFuncionario(@PathVariable Long id){
        return ResponseEntity.ok(funcionarioService.buscarPorId(id));
    }

//Define que o metodo representa requisicoes PUT. O {id} na URL indica qual funcionario sera editado
    @PutMapping("/{id}")
    //    PathVariable captura o id diretamente da URL (ex: /api/v1/funcionarios/3 -> id = 3)
    //    RequestBody recebe o json com os novos dados e transforma em FuncionarioEdicaoDTO
    public ResponseEntity<FuncionarioResponseDTO> editarFuncionario(@PathVariable Long id, @RequestBody @Valid FuncionarioEdicaoDTO edicaoDTO) {
//        Chama o service passando o id do funcionario e os novos dados
        FuncionarioResponseDTO alteracaoDTO = funcionarioService.editarFuncionario(id, edicaoDTO);
//          Retorna 200 OK com os dados atualizados do funcionario
        return ResponseEntity.ok().body(alteracaoDTO);
    }

//    Define que o metodo representa requisicoes DELETE. o {id} na URL indica o indice do funcionario a ser desativado
    @DeleteMapping("/{id}")
//    Nao utiliza request body pois ele sempre realizara a mesma alteracao (statusFuncionario = INATIVO)
    public ResponseEntity<FuncionarioResponseDTO> desativarFuncionario(@PathVariable Long id){
//        Chama desativarFuncionario do Service e passa o id da url
        FuncionarioResponseDTO desativacaoDTO = funcionarioService.desativarFuncionario(id);
//        Retorna 200 OK com o status como INATIVO
        return ResponseEntity.ok().body(desativacaoDTO);
    }
}