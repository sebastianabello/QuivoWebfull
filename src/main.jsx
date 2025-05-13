import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./i18n/i18n";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    }}
  >
    <Toaster position="top-right" />
    <App />
  </ReactKeycloakProvider>
);
