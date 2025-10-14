export class AuthService {
  getGithubAuthUrl(): string {
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = "user:email";

    return `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(redirectUri || "")}&scope=${scope}`;
  }
}

export const authService = new AuthService();
