import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { statusCodes } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { ITokenResponse } from "../interfaces/token.interface";

class TokenService {
  //Метод, який генерує пару токенів: accessToken і refreshToken на основі переданого payload
  public generatePair(payload: IJWTPayload): ITokenResponse {
    //jsonwebtoken - бібліотека з методом sign
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      accessExpiresIn: config.JWT_ACCESS_EXPIRES_IN,
      refreshToken,
      refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
    };
  }

  //Метод для перевірки дійсності токену
  public checkToken(token: string, type: TokenTypeEnum): IJWTPayload {
    //В залежності від типу токену (ACCESS або REFRESH) вибирається відповідний секрет
    try {
      let secret: string;
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;
        default:
          throw new ApiError("Invalid token type", statusCodes.UNAUTHORIZED);
      }
      //jsonwebtoken.verify використовується для перевірки токену з обраним секретом
      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", statusCodes.UNAUTHORIZED);
    }
  }
  //Метод для генерації спеціальних токенів дій, таких як "забути пароль" або "підтвердження"
  public generateActionToken(
    payload: IJWTPayload,
    type: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    //В залежності від типу дії (FORGOT або VERIFY) вибирається відповідний секрет і термін дії.
    switch (type) {
      case ActionTokenTypeEnum.FORGOT:
        secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
        expiresIn = config.JWT_ACTION_FORGOT_EXPIRES_IN;
        break;
      case ActionTokenTypeEnum.VERIFY:
        secret = config.JWT_ACTION_VERIFY_TOKEN_SECRET;
        expiresIn = config.JWT_ACTION_VERIFY_EXPIRES_IN;
        break;

      default:
        throw new ApiError(
          "Invalid token type",
          statusCodes.INTERNAL_SERVER_ERROR,
        );
    }
    //Генерується токен з використанням jsonwebtoken.sign з обраним секретом і терміном дії.
    return jsonwebtoken.sign(payload, secret, { expiresIn });
  }

  //Метод для перевірки дійсності спеціальних токенів дій
  public checkActionToken(
    token: string,
    type: ActionTokenTypeEnum,
  ): IJWTPayload {
    try {
      let secret: string;

      switch (type) {
        case ActionTokenTypeEnum.FORGOT:
          secret = config.JWT_ACTION_FORGOT_TOKEN_SECRET;
          break;

        case ActionTokenTypeEnum.VERIFY:
          secret = config.JWT_ACTION_VERIFY_TOKEN_SECRET;
          break;

        default:
          throw new ApiError(
            "Invalid token type",

            statusCodes.INTERNAL_SERVER_ERROR,
          );
      }

      return jsonwebtoken.verify(token, secret) as IJWTPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", statusCodes.UNAUTHORIZED);
    }
  }
}

export const tokenService = new TokenService();
