import { deleteCookie, getCookie, setCookie } from "cookies-next";

export class TokenManager {
  private cookieOptions: {
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
    path?: string;
  };

  constructor(isDevelopment = false) {
    this.cookieOptions = {
      secure: !isDevelopment,
      sameSite: "strict",
      path: "/",
    };
  }

  isServer(): boolean {
    return typeof window === "undefined";
  }

  setAccessToken(accessToken: string): void {
    setCookie("accessToken", accessToken, this.cookieOptions);
  }

  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    setCookie("refreshToken", refreshToken, this.cookieOptions);
  }

  getAccessToken(): string | undefined {
    const token = getCookie("accessToken");
    return typeof token === "string" ? token : undefined;
  }

  getRefreshToken(): string | undefined {
    const token = getCookie("refreshToken");
    return typeof token === "string" ? token : undefined;
  }

  removeAuthTokens(): void {
    deleteCookie("accessToken", { path: "/" });
    deleteCookie("refreshToken", { path: "/" });
  }
}
