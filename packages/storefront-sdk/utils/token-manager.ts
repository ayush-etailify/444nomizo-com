import Cookies from "js-cookie";

export class TokenManager {
  private cookieOptions: Cookies.CookieAttributes;

  constructor(isDevelopment = false) {
    this.cookieOptions = {
      secure: !isDevelopment,
      sameSite: "strict",
      path: "/",
    };
  }

  setAccessToken(accessToken: string): void {
    Cookies.set("accessToken", accessToken, this.cookieOptions);
  }

  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    Cookies.set("refreshToken", refreshToken, this.cookieOptions);
  }

  getAccessToken(): string | undefined {
    return Cookies.get("accessToken");
  }

  getRefreshToken(): string | undefined {
    return Cookies.get("refreshToken");
  }

  removeAuthTokens(): void {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
  }

  isServer(): boolean {
    return typeof window === "undefined";
  }
}
