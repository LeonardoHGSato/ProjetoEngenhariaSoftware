# ProjetoEngenhariaSoftware

Sistema de gerenciamento de chamadas de serviço para um provedor de internet.

## Descrição

O sistema permite o controle completo das operações de campo de um provedor de internet, incluindo o gerenciamento de funcionários, seus veículos e as chamadas de serviço atribuídas a eles.

## Funcionalidades

- **Perfil de funcionário** — cadastro e visualização de dados de cada técnico
- **Veículo** — associação de cada funcionário ao seu respectivo carro
- **Chamadas de serviço** — criação de chamadas pelo supervisor, atribuídas a funcionários
- **Tipos de chamada:** instalação, manutenção e retirada de equipamento
- **Histórico** — registro completo das chamadas realizadas por funcionário, com data, hora e endereço

## Tecnologias

- **Backend:** Java 25, Spring Boot 3
- **Frontend:** Next.js
- **Banco de dados:** PostgreSQL
- **Infraestrutura:** Docker

## Como executar

### Stack completa (Docker)

Para subir tudo — banco, backend e frontend — com um único comando, sem instalar
Java ou Node na máquina:

```bash
docker compose up --build
```

O frontend fica em `http://localhost:3000` e o backend em `http://localhost:8080`.
As portas, credenciais e a URL da API são configuráveis via `.env` (copie de `.env.example`).

Para o dia a dia de desenvolvimento, é comum subir só o banco no Docker e rodar
backend e frontend localmente (hot-reload e debug mais fáceis) — veja as seções abaixo.

### Banco de dados (Docker)

O Postgres de desenvolvimento sobe via Docker Compose, sem precisar instalar o banco na máquina:

```bash
docker compose up -d postgres
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
cp src/main/resources/application.properties.exemplo src/main/resources/application.properties
./mvnw spring-boot:run
```

Com o banco do compose no ar, o backend conecta sem ajustes adicionais.

### Frontend

```bash
cd frontend/trackfibra
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000` e consome a API em `http://localhost:8080`
(configurável via `NEXT_PUBLIC_API_URL`).

## Testes

### Frontend

A base de testes usa **Vitest** + **@testing-library/react** rodando em **jsdom**.

```bash
cd frontend/trackfibra
npm test           # roda a suíte uma vez
npm run test:watch # modo watch durante o desenvolvimento
```

Para criar um novo teste, adicione um arquivo `*.test.jsx` ao lado do componente
(ou em `__tests__/`) e use o teste de exemplo como molde: renderize com `render(...)`
do Testing Library e faça as asserções com os matchers de `@testing-library/jest-dom`.

### Backend

As dependências de teste (**JUnit 5** + **Mockito**, via `spring-boot-starter-test`) já
estão disponíveis e há um teste de carga de contexto de exemplo
(`TrackFibraBackEndApplicationTests`). A base completa — banco de teste isolado e perfil
`application-test`, sem tocar no banco de desenvolvimento — está sendo configurada na #33;
até lá o CI do backend roda com os testes pulados (`-DskipTests`).

```bash
cd backend
./mvnw test
```

Para criar um novo teste, adicione uma classe em `src/test/java/...` espelhando o
pacote da classe testada.
