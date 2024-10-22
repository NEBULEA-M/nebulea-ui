import { InternalAxiosRequestConfig } from "axios";

import { keycloak } from "@/core/keycloak/keycloak";

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: () => void) => {
  keycloak
    .init({
      onLoad: "check-sso",
      enableLogging: true,
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const getKeyCloak = () => keycloak;

const doLogin = keycloak.login;

const doLogout = keycloak.logout;

const getToken = () => keycloak.token;

const getTokenParsed = () => keycloak.tokenParsed;

const isLoggedIn = () => keycloak.authenticated;

const updateToken = (
  successCallback: () => Promise<InternalAxiosRequestConfig>,
): Promise<InternalAxiosRequestConfig> => {
  return keycloak
    .updateToken(5)
    .then(successCallback)
    .catch((error) => {
      // Handle error or perform necessary actions.
      // Might want to throw an error or return a default InternalAxiosRequestConfig.
      console.error("Token update error:", error);
      return Promise.reject(error); // Or return a default config: Promise.resolve(defaultConfig);
    });
};

const getUsername = () => keycloak.tokenParsed?.realm_access;

const hasRole = (roles: string[]) => roles.some((role: string) => keycloak.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
  hasRole,
  getKeyCloak: getKeyCloak,
};

export default UserService;
