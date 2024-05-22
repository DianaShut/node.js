import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { UserPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IUserListQuery; //Отримуємо параметри запиту з об'єкта запиту
      const [users, total] = await userService.getList(query); //Викликаємо метод getAllUsers сервісу userService, який приймає параметри запиту та повертає масив користувачів та загальну кількість користувачів
      const response = UserPresenter.toPublicResponseListDto(
        users,
        query,
        total,
      );
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);
      const response = UserPresenter.toPublicResponseDto(user);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
      const user = await userService.getMe(jwtPayload.userId);
      const response = UserPresenter.toPrivateResponseDto(user);
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
      const dto = req.body as Partial<IUser>;

      const user = await userService.updateMe(jwtPayload.userId, dto);
      const response = UserPresenter.toPrivateResponseDto(user);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
      await userService.deleteMe(jwtPayload.userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload; //Отримуємо ідентифікатор користувача з токену
      const avatar = req.files?.avatar as UploadedFile;

      const user = await userService.uploadAvatar(jwtPayload.userId, avatar); //Викликаємо метод uploadAvatar сервісу userService, який приймає ідентифікатор користувача та файл аватара
      const response = UserPresenter.toPrivateResponseDto(user); //Конвертуємо об'єкт користувача в приватну версію
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;

      const user = await userService.deleteAvatar(jwtPayload.userId); //Викликаємо метод deleteAvatar сервісу userService, який приймає ідентифікатор користувача
      const response = UserPresenter.toPrivateResponseDto(user);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
