package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.PerfilFuncionario;
import com.engenhariasoftware.trackfibrabackend.enums.StatusFuncionario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

//Construtores, Setters e Getters com lombok
@NoArgsConstructor
@Getter
@Setter

//Entidade jpa
@Entity
@Table (name = "funcionarios")
public class FuncionarioModel implements UserDetails {
//    Atributos da entidade
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //somente para o banco de dados

    @Column(name = "nome", nullable = false)
    private String nome;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "numero_telefone", nullable = false)
    private String numeroTelefone; //usamos somente os numeros
    @Column(name = "cpf", unique = true, nullable = false)
    private String cpf; //usamos somente os numeros

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusFuncionario statusFuncionario = StatusFuncionario.ATIVO;

    @Column(name = "perfil", nullable = false)
    @Enumerated(EnumType.STRING)
    private PerfilFuncionario perfilFuncionario = PerfilFuncionario.TECNICO;

    @Override
    public boolean isEnabled(){
        return this.statusFuncionario == StatusFuncionario.ATIVO;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfilFuncionario.name()));
    }

    @Override
    public String getUsername(){
        return email;
    }

    @Override
    public String getPassword() {
        return this.senha;
    }
}