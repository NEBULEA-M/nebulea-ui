import AuthService from "./AuthService";

class UserService {
  static async isLoggedIn(): Promise<boolean> {
    const token = await AuthService.getStoredToken();
    return !!token;
  }

  static async getCurrentUser(): Promise<any | null> {
    return await AuthService.getStoredUser();
  }

  static async hasRole(roles: string[]): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user || !user.roles) return false;
    return roles.some((role: string) => user.roles.includes(role));
  }
}

export default UserService;
