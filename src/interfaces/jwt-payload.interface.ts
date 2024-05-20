import { RoleEnum } from "../enums/role.enum";

export interface IJWTPayload {
  userId: string;
  role: RoleEnum;
} // Цей інтерфейс використовується для опису об'єкта, який містить дані, які будуть закодовані в JWT токені. Ці дані використовуються для ідентифікації користувача під час авторизації.
