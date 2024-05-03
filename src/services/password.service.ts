// Імпорт модуля bcrypt для хешування та перевірки паролів
import * as bcrypt from "bcrypt";

import { config } from "../configs/config";

class PasswordService {
  public async hashPassword(password: string): Promise<string> {
    // Оголошення асинхронного методу 'hashPassword', який приймає пароль та повертає хешований пароль.
    return await bcrypt.hash(password, config.HASH_ROUNDS); // Хешування паролю з використанням кількості раундів, вказаних в конфігурації.
  }

  // Оголошення асинхронного методу 'comparePassword', який приймає пароль та хешований пароль та повертає результат порівняння.
  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword); // Порівняння паролю та хешованого паролю.
  }
}

export const passwordService = new PasswordService();
