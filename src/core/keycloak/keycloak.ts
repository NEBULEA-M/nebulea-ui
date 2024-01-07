import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8086',
  realm: 'nebulea-realm',
  clientId: 'nebulea-client',
});
