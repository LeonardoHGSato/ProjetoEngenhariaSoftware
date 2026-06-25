export const ROLES = {
  supervisor: "ROLE_SUPERVISOR",
  tecnico: "ROLE_TECNICO",
};

// Itens da sidebar. Cada item informa em quais perfis ele aparece.
export const ITENS_MENU = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: [ROLES.supervisor, ROLES.tecnico],
  },
  {
    label: "Chamadas",
    href: "/chamadas",
    roles: [ROLES.supervisor],
  },
  {
    label: "Minhas Chamadas",
    href: "/minhas-chamadas",
    roles: [ROLES.tecnico],
  },
  {
    label: "Funcionários",
    href: "/funcionarios",
    roles: [ROLES.supervisor],
  },
  {
    label: "Veículos",
    href: "/veiculos",
    roles: [ROLES.supervisor],
  },
  {
    label: "Clientes",
    href: "/clientes",
    roles: [ROLES.supervisor],
  },
  {
    label: "Meu Perfil",
    href: "/meu-perfil",
    roles: [ROLES.supervisor, ROLES.tecnico],
  },
];

export function itensPorPerfil(role) {
  if (!role) return [];
  return ITENS_MENU.filter((item) => item.roles.includes(role));
}
