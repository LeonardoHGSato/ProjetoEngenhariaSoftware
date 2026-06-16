"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { itensPorPerfil } from "@/config/menu";
import styles from "./Sidebar.module.css";

export default function Sidebar({ onNavegar }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const itens = itensPorPerfil(user?.role);

  function ehAtivo(href) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.marca}>TrackFibra</div>

      <nav className={styles.nav}>
        {itens.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${ehAtivo(item.href) ? styles.ativo : ""}`}
            onClick={onNavegar}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button type="button" className={styles.sair} onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}
