CREATE TABLE chamada_status_log (
        id BIGSERIAL PRIMARY KEY,
        chamada_id  BIGINT NOT NULL REFERENCES chamadas(id),
        status      VARCHAR(20) NOT NULL,
        alterado_em TIMESTAMP NOT NULL
);