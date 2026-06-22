import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "@/components/Loading";

// Teste de exemplo servindo de molde para novos testes de componente:
//  - render(...) monta o componente no DOM (jsdom)
//  - screen.getBy* localiza elementos
//  - expect(...).matcher faz a asserção (matchers de jest-dom já disponíveis)
describe("Loading", () => {
  it("exibe a mensagem informada", () => {
    render(<Loading mensagem="Carregando clientes..." />);

    expect(screen.getByText("Carregando clientes...")).toBeInTheDocument();
  });

  it("expõe o papel de status para leitores de tela", () => {
    render(<Loading mensagem="Carregando..." />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("não renderiza parágrafo de mensagem quando ela não é informada", () => {
    render(<Loading />);

    expect(screen.queryByText("Carregando clientes...")).not.toBeInTheDocument();
  });
});
