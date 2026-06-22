# ProjetoEngenhariaSoftware

Sistema de gerenciamento de chamadas de serviço para um provedor de internet.

## Descrição

O sistema permite o controle completo das operações de campo de um provedor de internet, incluindo o gerenciamento de funcionários, seus veículos e as chamadas de serviço atribuídas a eles.

## Funcionalidades

- **Perfil de funcionário** — cadastro e visualização de dados de cada técnico
- **Veículo** — associação de cada funcionário ao seu respectivo carro
- **Chamadas de serviço** — criação de chamadas pelo supervisor, atribuídas a funcionários
- **Tipos de chamada:** instalação, manutenção e corte
- **Histórico** — registro completo das chamadas realizadas por funcionário, com data, hora e endereço

## Tecnologias

- **Backend:** Java 25, Spring Boot 3
- **Frontend:** Next.js
- **Banco de dados:** PostgreSQL
- **Infraestrutura:** Docker

## Como executar

### Banco de dados (Docker)

O Postgres de desenvolvimento sobe via Docker Compose, sem precisar instalar o banco na máquina:

```bash
docker compose up -d
```

Isso cria um Postgres na porta `5432`, com banco/usuário/senha `trackfibra` e os dados
persistidos no volume `trackfibra_pgdata`. Para acompanhar os logs ou derrubar o banco:

```bash
docker compose logs -f postgres   # acompanha os logs
docker compose down               # para o banco (mantém os dados)
docker compose down -v            # para e apaga os dados do volume
```

As credenciais padrão já batem com o `application.properties.example`. Para sobrescrevê-las,
copie `.env.example` para `.env` e ajuste os valores antes de subir o compose.

### Backend

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
./mvnw spring-boot:run
```

Com o banco do compose no ar, o backend conecta sem ajustes adicionais.
