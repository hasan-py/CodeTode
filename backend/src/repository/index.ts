import { AppDataSource } from "../config/dataSource";
import { User } from "../entity/account/ user";
import { RefreshToken } from "../entity/account/refreshToken";

export const UserRepository = AppDataSource.getRepository(User);
export const RefreshTokenRepository = AppDataSource.getRepository(RefreshToken);
