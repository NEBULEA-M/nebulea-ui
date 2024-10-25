import { Storage } from "@ionic/storage";

import { HttpService } from "./HttpService";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    username: string;
    roles: string[];
  };
}

class AuthService {
  private static storage: Storage | null = null;
  private static AUTH_TOKEN_KEY = "auth_token";
  private static USER_DATA_KEY = "user_data";

  static async initStorage() {
    if (!this.storage) {
      this.storage = new Storage();
      await this.storage.create();
    }
  }

  static async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await HttpService.getAxiosClient().post<AuthResponse>("http://127.0.0.1:8089/auth", credentials);

      await this.setToken(response.data.token);
      await this.setUserData(response.data.user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      await HttpService.getAxiosClient().post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await this.clearAuth();
    }
  }

  static async getStoredToken(): Promise<string | null> {
    return (await this.storage?.get(this.AUTH_TOKEN_KEY)) || null;
  }

  static async getStoredUser(): Promise<any | null> {
    const userData = await this.storage?.get(this.USER_DATA_KEY);
    return userData ? JSON.parse(await userData) : null;
  }

  private static async setToken(token: string): Promise<void> {
    await this.storage?.set(this.AUTH_TOKEN_KEY, token);
  }

  private static async setUserData(userData: any): Promise<void> {
    await this.storage?.set(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  static async clearAuth(): Promise<void> {
    try {
      localStorage.removeItem(this.USER_DATA_KEY);
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      // Clear any other auth-related items
    } catch (error) {
      console.error("Failed to clear storage:", error);
      throw error;
    }
  }
}

export default AuthService;
