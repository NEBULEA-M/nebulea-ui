import AuthService from "@/core/services/AuthService";

class UserService {
  static async isLoggedIn(): Promise<boolean> {
    return await AuthService.validateAndRefreshTokens();
  }

  static async getCurrentUser(): Promise<any | null> {
    try {
      const isValid = await this.isLoggedIn();
      if (!isValid) {
        return null;
      }
      return await AuthService.getStoredUser();
    } catch (error) {
      console.error("Get current user failed:", error);
      return null;
    }
  }

  static async hasRole(roles: string[]): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user || !user.roles) return false;
      return roles.some((role: string) => user.roles.includes(role));
    } catch (error) {
      console.error("Role check failed:", error);
      return false;
    }
  }
}

export default UserService;
