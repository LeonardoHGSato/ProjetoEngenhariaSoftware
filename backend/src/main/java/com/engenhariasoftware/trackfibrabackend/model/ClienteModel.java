package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCliente;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clientes")
public class ClienteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false, length = 150)
    private String nome;

    @NotBlank(message = "O CPF ou CNPJ é obrigatório")
    @Column(name = "cpf_cnpj", nullable = false, unique = true, length = 14)
    private String cpfCnpj;

    @NotBlank(message = "O telefone é obrigatório")
    @Column(nullable = false, length = 11)
    private String telefone;

    @Email(message = "Formato de e-mail inválido")
    @Column(length = 254)
    private String email;

    @Valid
    @Embedded
    private Endereco endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCliente status = StatusCliente.ATIVO;
}

