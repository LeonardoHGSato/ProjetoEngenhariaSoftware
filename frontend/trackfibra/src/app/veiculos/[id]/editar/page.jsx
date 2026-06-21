"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import RoleRoute from "@/components/RoleRoute";
import VeiculoForm from "@/components/VeiculoForm";
import Loading from "@/components/Loading";
import ErroEstado from "@/components/ErroEstado";
import { ROLES } from "@/config/menu";
import { useToast } from "@/context/ToastContext";
import { buscarVeiculo, editarVeiculo } from "@/services/veiculos";
import styles from "../../veiculos.module.css";

export default function EditarVeiculoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const [veiculo, setVeiculo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await buscarVeiculo(id);
      setVeiculo(dados);
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSubmit(payload) {
    setEnviando(true);
    try {
      await editarVeiculo(id, payload);
      toast.success("Veículo atualizado.");
      router.push("/veiculos");
    } catch {
      // Erros já são exibidos via toast pelo interceptor de api.
      setEnviando(false);
    }
  }

  return (
    <RoleRoute requiredRole={ROLES.supervisor}>
      <AppShell>
        <div className={styles.cabecalho}>
          <h1>Editar veículo</h1>
          <Link href="/veiculos" className={styles.acaoEditar}>
            Voltar
          </Link>
        </div>

        {carregando ? (
          <Loading mensagem="Carregando veículo..." />
        ) : erro ? (
          <ErroEstado
            mensagem="Não foi possível carregar o veículo."
            onRetry={carregar}
          />
        ) : (
          <VeiculoForm
            modo="editar"
            valoresIniciais={veiculo}
            onSubmit={handleSubmit}
            enviando={enviando}
          />
        )}
      </AppShell>
    </RoleRoute>
  );
}
