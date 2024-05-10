import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi"; // Імпорт класу ApiError для створення помилок API з кастомним повідомленням та статус-кодом.
import { isObjectIdOrHexString } from "mongoose"; // Імпорт функції перевірки, чи є заданий рядок коректним ObjectId або hex-рядком.

import { statusCodes } from "../constants/status-code.constants";
import { ApiError } from "../errors/api-error";

// Визначення класу CommonMiddleware, який містить методи middleware для використання в додатку.
class CommonMiddleware {
  // Функція middleware, що перевіряє валідність ID користувача.
  public isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання ID з параметрів запиту.
      const id = req.params.userId;
      // Перевірка, чи є ID коректним ObjectId або hex-рядком.
      if (!isObjectIdOrHexString(id)) {
        throw new ApiError("Invalid id", statusCodes.BAD_REQUEST);
      }
      // Якщо ID валідний, передаємо виконання наступному обробнику у ланцюжку.
      next();
    } catch (e) {
      // У випадку виникнення помилки передаємо її в обробник помилок.
      next(e);
    }
  }

  public isBodyValid(validator: ObjectSchema) {
    //ObjectSchema - це тип, який представляє схему Joi для валідації об'єктів
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body); //Цей рядок асинхронно валідує дані в req.body за допомогою переданої схеми Joi (validator)
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

// Експорт екземпляра CommonMiddleware для використання у інших частинах додатку.
export const commonMiddleware = new CommonMiddleware();
