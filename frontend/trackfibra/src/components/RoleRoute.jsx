"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/context/AuthContext";

export default function RoleRoute({ requiredRole, children }) {
  const router = useRouter();
  const { user, carregando, isAuthenticated } = useAuth();

  const temPermissao = !requiredRole || user?.role === requiredRole;

  useEffect(() => {
    if (!carregando && isAuthenticated && !temPermissao) {
      router.replace("/403");
    }
  }, [carregando, isAuthenticated, temPermissao, router]);

  return (
    <PrivateRoute>{temPermissao ? children : null}</PrivateRoute>
  );
}
