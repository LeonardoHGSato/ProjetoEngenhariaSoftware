CREATE TABLE funcionarios(
        id BIGSERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        senha VARCHAR(60) NOT NULL,
        numero_telefone CHAR(14) NOT NULL,
        cpf CHAR(11) NOT NULL UNIQUE,
        status VARCHAR(20) NOT NULL,
        perfil VARCHAR(20) NOT NULL
);