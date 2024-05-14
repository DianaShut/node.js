import { NextFunction, Request, Response } from "express";

import { statusCodes } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

//AuthMiddleware - містить методи для перевірки токенів
class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      //Отримання токену з заголовка запиту
      const accessToken = req.get("Authorization");
      //Перевірка наявності токена
      if (!accessToken) {
        throw new ApiError("No token provided", statusCodes.UNAUTHORIZED);
      }
      // Перевірка валідності токену доступу
      const payload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );
      //Перевірка наявності токена в базі даних
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
      //Отримує токен оновлення з заголовка Authorization
      const refreshToken = req.get("Authorization");
      if (!refreshToken) {
        throw new ApiError("No token provided", statusCodes.UNAUTHORIZED);
      }
      //Перевірка валідності токена оновлення
      const payload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
      //Перевірка наявності токена в базі даних:
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

  public checkActionToken(type: ActionTokenTypeEnum, key = "token") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        //Отримує action token з запиту (req.query)
        const actionToken = req.query[key] as string;
        //Перевірка наявності токена
        if (!actionToken) {
          throw new ApiError("No token provided", statusCodes.BAD_REQUEST);
        }
        //Перевірка валідності токена
        const payload = tokenService.checkActionToken(actionToken, type);
        //Перевірка наявності токена в базі даних
        const entity = await actionTokenRepository.findByParams({
          actionToken,
        });
        if (!entity) {
          throw new ApiError("Invalid token", statusCodes.UNAUTHORIZED);
        }
        //Зберігається payload токена у res.locals
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
