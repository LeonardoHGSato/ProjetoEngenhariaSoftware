package com.engenhariasoftware.trackfibrabackend.model;

import com.engenhariasoftware.trackfibrabackend.enums.StatusCarro;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "carros")
public class Carro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A placa é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$",
            message = "Formato de placa inválido.Use o padrão Antigo (ABC1234) ou Mercosul (ABC1D23)")
    @Column(nullable = false, unique = true, length = 7)
    private String placa;

    @NotBlank(message = "O modelo é obrigatório")
    @Column(nullable = false)
    private String modelo;

    @NotBlank(message = "A marca é obrigatória")
    @Column(nullable = false)
    private String marca;

    @NotNull(message = "O ano é obrigatório")
    @Column(nullable = false)
    private Integer ano;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCarro status = StatusCarro.DISPONIVEL;
}

