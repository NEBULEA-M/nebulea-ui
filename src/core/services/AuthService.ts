import { Storage } from "@ionic/storage";
import { jwtDecode } from "jwt-decode";

import { HttpService } from "@/core/services/HttpService";
import { JWTPayload } from "@/core/types/Auth";
import { SERVER_ENDPOINT } from "@/env";

interface LoginCredentials {
  username: string;
  password: string;
}

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    username: string;
    roles: string[];
  };
}

class AuthService {
  private static storage: Storage | null = null;
  private static ACCESS_TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";
  private static USER_DATA_KEY = "user_data";
  private static isInitializing = false;
  private static initPromise: Promise<void> | null = null;

  static async initStorage() {
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitializing) {
      // Wait for existing initialization to complete
      return new Promise<void>((resolve) => {
        const checkInit = setInterval(() => {
          if (!this.isInitializing) {
            clearInterval(checkInit);
            resolve();
          }
        }, 100);
      });
    }

    this.isInitializing = true;
    this.initPromise = (async () => {
      try {
        if (!this.storage) {
          this.storage = new Storage();
          await this.storage.create();
        }
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  static async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await HttpService.getAxiosClient().post<AuthResponse>(
        `${SERVER_ENDPOINT}/auth`,
        credentials,
      );

      await this.setTokens({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      });
      await this.setUserData(response.data.user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    return this.storage?.get(this.ACCESS_TOKEN_KEY) || null;
  }

  static async getRefreshToken(): Promise<string | null> {
    return this.storage?.get(this.REFRESH_TOKEN_KEY) || null;
  }

  static async setTokens(tokens: TokenPair): Promise<void> {
    if (!this.storage) {
      throw new Error("Storage not initialized");
    }

    const promises = [
      this.storage.set(this.ACCESS_TOKEN_KEY, tokens.access_token),
      this.storage.set(this.REFRESH_TOKEN_KEY, tokens.refresh_token),
    ];

    await Promise.all(promises);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  static async validateAndRefreshTokens(): Promise<boolean> {
    try {
      // Check if we have both tokens
      const accessToken = await this.getAccessToken();
      const refreshToken = await this.getRefreshToken();

      if (!accessToken || !refreshToken) {
        return false;
      }

      // Check if access token is still valid
      if (!this.isTokenExpired(accessToken)) {
        return true;
      }

      // Check if refresh token is valid
      if (this.isTokenExpired(refreshToken)) {
        await this.clearAuth();
        return false;
      }

      // Try to refresh the access token
      try {
        const newTokens = await HttpService.refreshAccessToken();
        return newTokens !== null;
      } catch (error) {
        console.error("Token refresh failed:", error);
        await this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      await this.clearAuth();
      return false;
    }
  }

  static async getStoredUser(): Promise<any> {
    if (!this.storage) {
      throw new Error("Storage not initialized");
    }
    const userData = await this.storage.get(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private static async setUserData(userData: any): Promise<void> {
    if (!this.storage) {
      throw new Error("Storage not initialized");
    }
    await this.storage.set(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  static async clearAuth(): Promise<void> {
    try {
      if (!this.storage) {
        throw new Error("Storage not initialized");
      }
      const promises = [
        this.storage.remove(this.ACCESS_TOKEN_KEY),
        this.storage.remove(this.REFRESH_TOKEN_KEY),
        this.storage.remove(this.USER_DATA_KEY),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.error("Failed to clear storage:", error);
      throw error;
    }
  }
}

export default AuthService;
