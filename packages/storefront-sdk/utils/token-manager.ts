export class TokenManager {
  private isDevelopment: boolean;

  constructor(isDevelopment = false) {
    this.isDevelopment = isDevelopment;
  }

  private setCookie(name: string, value: string): void {
    if (this.isServer()) return;

    const secure = !this.isDevelopment ? "; Secure" : "";
    const sameSite = "; SameSite=Strict";
    const path = "; Path=/";

    document.cookie = `${name}=${value}${path}${sameSite}${secure}`;
  }

  private getCookie(name: string): string | undefined {
    if (this.isServer()) return undefined;

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return undefined;
  }

  private removeCookie(name: string): void {
    if (this.isServer()) return;

    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  setAccessToken(accessToken: string): void {
    this.setCookie("accessToken", accessToken);
  }

  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setCookie("refreshToken", refreshToken);
  }

  getAccessToken(): string | undefined {
    return this.getCookie("accessToken");
  }

  getRefreshToken(): string | undefined {
    return this.getCookie("refreshToken");
  }

  removeAuthTokens(): void {
    this.removeCookie("accessToken");
    this.removeCookie("refreshToken");
  }

  isServer(): boolean {
    return typeof window === "undefined";
  }
}
