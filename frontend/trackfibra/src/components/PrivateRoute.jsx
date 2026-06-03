"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Envolve páginas que exigem login. Enquanto a sessão é hidratada do storage
// não renderiza nada; sem token, redireciona para /login.
export default function PrivateRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, carregando } = useAuth();

  useEffect(() => {
    if (!carregando && !isAuthenticated) {
      router.replace("/login");
    }
  }, [carregando, isAuthenticated, router]);

  if (carregando || !isAuthenticated) {
    return null;
  }

  return children;
}
