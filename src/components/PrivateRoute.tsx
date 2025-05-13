import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { ReactElement } from "react";

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div className="text-center mt-10 text-gray-500">Cargando autenticación...</div>;
  }

  return keycloak.authenticated ? children : <Navigate to="/" replace />;
}
