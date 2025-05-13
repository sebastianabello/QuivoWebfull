import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:9191",
  realm: "quivo",
  clientId: "customer-webapp",
});

export default keycloak;
