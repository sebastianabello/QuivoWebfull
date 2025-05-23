// src/components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { ReactElement } from "react";

export default function AdminRoute({ children }: { children: ReactElement }) {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div className="text-center mt-10 text-gray-500">Cargando...</div>;

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.includes("adminn");

  return isAdmin ? children : <Navigate to="/" replace />;
}
