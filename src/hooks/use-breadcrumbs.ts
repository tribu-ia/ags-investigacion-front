import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  "centro-investigacion": "Centro de Investigación",
  agente: "Agente Investigador",
  guias: "Guias y Recursos",
  documentation: "Documentación",
  eventos: "Eventos",
  "mis-investigaciones": "Mis Investigaciones",
  "nuevo-agente": "Investigar Nuevo Agente",
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment;
    const isCurrentPage = index === pathSegments.length - 1;

    return {
      label,
      href,
      isCurrentPage,
    };
  });
}
