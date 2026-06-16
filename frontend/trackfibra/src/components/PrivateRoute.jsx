"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
