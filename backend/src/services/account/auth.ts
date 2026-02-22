import { Octokit } from "@octokit/rest";
import { EUserRole, EUserStatus } from "@packages/definitions";
import { Logger } from "@packages/logger";
import axios from "axios";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../../entity/account/refreshToken";
import { RefreshTokenRepository, UserRepository } from "../../repository";
import { User } from "../../entity/account/user";

const TOKEN_CONFIG = {
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRES_IN || "60s",
  refreshTokenExpiration: parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_IN || "120"
  ),
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  maxDevicesPerUser: parseInt(process.env.MAX_DEVICES_PER_USER || "3"),
};

export class AuthService {
  private UserRepository = UserRepository;
  private RefreshTokenRepository = RefreshTokenRepository;
  private refreshTokenExpiresIn = TOKEN_CONFIG.refreshTokenExpiration * 1000; // Convert to milliseconds

  private jwtSecret = TOKEN_CONFIG.jwtSecret;
  private jwtExpiresIn = TOKEN_CONFIG.accessTokenExpiration;

  getGithubAuthUrl(): string {
    const redirectUri = process.env.GITHUB_CALLBACK_URL;
    const scope = "user:email";

    return `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(redirectUri || "")}&scope=${scope}`;
  }

  async handleGithubCallback(
    code: string,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    try {
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const tokenData = tokenResponse.data;
      if (tokenData.error) {
        throw new Error(`GitHub Error: ${tokenData.error_description}`);
      }

      const accessToken = tokenData.access_token;
      const userOctokit = new Octokit({ auth: accessToken });
      const { data: githubUser } = await userOctokit.users.getAuthenticated();
      const { data: emails } =
        await userOctokit.users.listEmailsForAuthenticatedUser();
      const primaryEmail =
        emails.find((email) => email.primary)?.email || emails[0]?.email;

      let user = await this.UserRepository.findOne({
        where: { githubId: githubUser.id.toString() },
      });

      if (!user) {
        user = new User();
        user.githubId = githubUser.id.toString();
        user.role = EUserRole.LEARNER;
        user.status = EUserStatus.ACTIVE;
        user.name = githubUser.name || githubUser.login;
        user.imageUrl = githubUser.avatar_url;
        user.username = githubUser.login;
        user.email = primaryEmail || githubUser.email;
      }

      user.lastLogin = new Date();
      await this.UserRepository.save(user);

      const jwtToken = this.generateJwtToken(user);
      const refreshToken = await this.generateRefreshToken(
        user,
        deviceInfo,
        ipAddress
      );

      return {
        accessToken: jwtToken,
        refreshToken: refreshToken,
        user: user,
      };
    } catch (error) {
      Logger.error("GitHub OAuth error:", error);
      throw new Error("Authentication failed");
    }
  }

  async logout(refreshTokenString: string): Promise<boolean> {
    const result = await this.RefreshTokenRepository.update(
      { token: refreshTokenString },
      { isRevoked: true }
    );

    return result.affected ? result.affected > 0 : false;
  }

  async refreshAccessToken(
    refreshTokenString: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.RefreshTokenRepository.findOne({
      where: { token: refreshTokenString, isRevoked: false },
    });

    if (!refreshToken || new Date() > refreshToken.expiresAt) {
      throw new Error("Invalid or expired refresh token");
    }

    // Find the user
    const user = await this.UserRepository.findOne({
      where: { id: refreshToken.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate new access token
    const accessToken = this.generateJwtToken(user);

    // Check if token needs expiration extension
    const now = new Date();
    const remainingTime = refreshToken.expiresAt.getTime() - now.getTime();
    const halfExpirationTime = this.refreshTokenExpiresIn / 2;

    // Only update expiration if less than half the time remains
    if (remainingTime < halfExpirationTime) {
      const newExpiryDate = new Date();
      newExpiryDate.setTime(
        newExpiryDate.getTime() + this.refreshTokenExpiresIn
      );
      refreshToken.expiresAt = newExpiryDate;
      await this.RefreshTokenRepository.save(refreshToken);
    }

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  verifyToken(token: string): { userId: number; role: EUserRole } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret as jwt.Secret) as {
        userId: number;
        role: EUserRole;
      };
      return decoded;
    } catch (error) {
      Logger.debug("Token verification failed:", error.message);
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(`JWT error: ${error.message}`);
      }
      throw new Error(
        `Invalid token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private generateJwtToken(user: User): string {
    const payload = {
      userId: user.id,
      role: user.role,
      status: user.status,
    };

    return jwt.sign(
      payload,
      this.jwtSecret as jwt.Secret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions
    );
  }

  private async generateRefreshToken(
    user: User,
    deviceInfo?: string,
    ipAddress?: string
  ): Promise<string> {
    const deviceFingerprint = this.getDeviceFingerprint(deviceInfo, ipAddress);

    // Find existing token for this device
    const existingToken = await this.RefreshTokenRepository.findOne({
      where: {
        userId: user.id,
        isRevoked: false,
        deviceInfo: deviceInfo || null,
        ipAddress: ipAddress || null,
      },
      order: { expiresAt: "DESC" },
    });

    // Reuse token if it exists and has enough validity time left
    if (existingToken) {
      const now = new Date();
      const halfExpirationTime = this.refreshTokenExpiresIn / 2;
      const remainingTime = existingToken.expiresAt.getTime() - now.getTime();

      if (remainingTime > halfExpirationTime) {
        return existingToken.token;
      }

      // Extend token expiry if it's expiring soon
      const newExpiryDate = new Date();
      newExpiryDate.setTime(
        newExpiryDate.getTime() + this.refreshTokenExpiresIn
      );

      existingToken.expiresAt = newExpiryDate;
      await this.RefreshTokenRepository.save(existingToken);

      return existingToken.token;
    }

    // Handle device limits
    const activeTokens = await this.RefreshTokenRepository.find({
      where: { userId: user.id, isRevoked: false },
    });

    // Count unique devices
    const activeDevices = new Set();
    activeTokens.forEach((token: RefreshToken) => {
      const fingerprint = this.getDeviceFingerprint(
        token.deviceInfo,
        token.ipAddress
      );
      activeDevices.add(fingerprint);
    });

    // Revoke oldest token if device limit reached
    if (
      activeDevices.size >= TOKEN_CONFIG.maxDevicesPerUser &&
      !activeDevices.has(deviceFingerprint)
    ) {
      const oldestToken = activeTokens.sort(
        (a: RefreshToken, b: RefreshToken) =>
          a.createdAt.getTime() - b.createdAt.getTime()
      )[0];

      if (oldestToken) {
        oldestToken.isRevoked = true;
        await this.RefreshTokenRepository.save(oldestToken);
      }
    }

    // Create new token
    const tokenValue = uuidv4();
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + this.refreshTokenExpiresIn);

    const newToken = new RefreshToken();
    newToken.token = tokenValue;
    newToken.userId = user.id;
    newToken.expiresAt = expiryDate;
    newToken.deviceInfo = deviceInfo || null;
    newToken.ipAddress = ipAddress || null;

    await this.RefreshTokenRepository.save(newToken);

    return tokenValue;
  }

  private getDeviceFingerprint(
    deviceInfo?: string,
    ipAddress?: string
  ): string {
    const baseData = `${deviceInfo || "unknown"}-${ipAddress || "unknown"}`;
    return createHash("sha256").update(baseData).digest("hex");
  }
}

export const authService = new AuthService();
