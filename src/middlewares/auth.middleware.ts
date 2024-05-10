import { NextFunction, Request, Response } from "express";

import { statusCodes } from "../constants/status-code.constants";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization"); // Отримання токену з заголовка запиту
      if (!accessToken) {
        throw new ApiError("No token provided", statusCodes.UNAUTHORIZED); // Викидання помилки, якщо токен не було передано
      }
      const payload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      ); // Перевірка токену

      const tokenPair = await tokenRepository.findByParams({ accessToken });
      if (!tokenPair) {
        throw new ApiError("Invalid token", statusCodes.UNAUTHORIZED);
      }
      req.res.locals.jwtPayload = payload; // Збереження даних з токену в локальний об'єкт res.locals для подальшого використання
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Authorization");
      if (!refreshToken) {
        throw new ApiError("No token provided", statusCodes.UNAUTHORIZED);
      }
      const payload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const tokenPair = await tokenRepository.findByParams({ refreshToken });
      if (!tokenPair) {
        throw new ApiError("Invalid token", statusCodes.UNAUTHORIZED);
      }
      req.res.locals.jwtPayload = payload; // Збереження даних з токену в локальний об'єкт res.locals
      req.res.locals.tokenPair = tokenPair; // Збереження токенів в локальний об'єкт res.locals
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
