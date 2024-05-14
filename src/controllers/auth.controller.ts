import { NextFunction, Request, Response } from "express";

import { statusCodes } from "../constants/status-code.constants";
import {
  IForgotPassword,
  INewPasswordAfterForgot,
} from "../interfaces/action-token.interface";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { AuthPresenter } from "../presenters/auth.presenter";
import { UserPresenter } from "../presenters/user.presenter";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as Partial<IUser>;
      const data = await authService.signUp(dto);
      res.status(statusCodes.CREATED).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as { email: string; password: string };
      const data = await authService.signIn(dto);
      const response = AuthPresenter.toResponseDto(data);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload; // Отримання jwtPayload з middleware
      const tokenPair = req.res.locals.tokenPair as IToken; // Отримання токенів з middleware checkJwt
      const data = await authService.refresh(jwtPayload, tokenPair); // Виклик сервісу для оновлення токенів
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IForgotPassword;
      await authService.forgotPassword(body);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async newPasswordAfterForgot(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
      const body = req.body as INewPasswordAfterForgot;

      await authService.newPasswordAfterForgot(body, jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;

      const user = await authService.verify(jwtPayload);
      const response = UserPresenter.toPrivateResponseDto(user);

      res.status(statusCodes.CREATED).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
