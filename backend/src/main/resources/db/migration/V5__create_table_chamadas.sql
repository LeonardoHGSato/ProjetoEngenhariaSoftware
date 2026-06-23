CREATE TABLE chamadas(
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    funcionario_id BIGINT NOT NULL REFERENCES funcionarios(id),
    carro_id BIGINT NOT NULL REFERENCES carros(id),
    tipo_servico VARCHAR(50) NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA',
    relato TEXT,
    motivo_cancelamento VARCHAR(255),
    cep VARCHAR(8) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL
);