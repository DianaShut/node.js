import { config } from "../configs/config";
import { statusCodes } from "../constants/status-code.constants";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import {
  IForgotPassword,
  INewPasswordAfterForgot,
} from "../interfaces/action-token.interface";
import { IJWTPayload } from "../interfaces/jwt-payload.interface";
import { IToken, ITokenResponse } from "../interfaces/token.interface";
import { IChangePassword, IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
import { smsPrepareService } from "./sms-prepare.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenResponse }> {
    //Перевіряє, чи існує вже електронна пошта
    await this.isEmailExist(dto.email);
    //Хешує пароль користувача
    const hashedPassword = await passwordService.hashPassword(dto.password);
    //Створює нового користувача в базі даних
    const user = await userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
    //Генерує пару токенів (доступу та оновлення)
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });

    //Зберігає токени в базі даних i генерує токен дії для верифікації
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });

    await Promise.all([
      //Відправляє вітальний лист
      sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
        name: dto.name,
        frontUrl: config.FRONT_URL,
        actionToken: "actionToken", // actionToken - це токен, який використовується для підтвердження email-у
      }),
      //Реєструє номер телефону
      smsPrepareService.register(user.phone, { name: user.name }),
    ]);
    //Повертає об'єкт з користувачем та токенами
    return { user, tokens };
  }

  public async signIn(dto: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: ITokenResponse }> {
    //Шукає користувача за електронною поштою
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) {
      throw new ApiError("Wrong email or password", 401);
    }
    //Перевіряє пароль
    const isCompare = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError("Wrong email or password", 401);
    }
    //Генерує нову пару токенів
    const tokens = tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });

    //Зберігає токени в базі даних
    await tokenRepository.create({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _userId: user._id,
    });
    return { user, tokens };
  }

  public async refresh(
    jwtPayload: IJWTPayload,
    oldPair: IToken,
  ): Promise<ITokenResponse> {
    //Генерує нову пару токенів на основі існуючого JWT-пейлоада
    const newPair = tokenService.generatePair({
      userId: jwtPayload.userId,
      role: jwtPayload.role,
    });
    //Видаляє старі токени з бази даних
    await tokenRepository.deleteById(oldPair._id);
    //Зберігає нові токени
    await tokenRepository.create({
      ...newPair,
      _userId: jwtPayload.userId,
    });
    //Повертає нову пару токенів
    return newPair;
  }

  public async forgotPassword(dto: IForgotPassword): Promise<void> {
    //Шукає користувача за електронною поштою
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;
    //Генерує токен дії для відновлення паролю
    const actionToken = tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenTypeEnum.FORGOT,
    );
    //Зберігає токен в базі даних
    await actionTokenRepository.create({
      tokenType: ActionTokenTypeEnum.FORGOT,
      actionToken,
      _userId: user._id,
    });
    //Відправляє лист з посиланням для відновлення паролю
    await sendGridService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
      frontUrl: config.FRONT_URL,
      actionToken,
    });
  }

  public async newPasswordAfterForgot(
    dto: INewPasswordAfterForgot,
    jwtPayload: IJWTPayload,
  ): Promise<void> {
    //Знаходить користувача за ID
    const user = await userRepository.getUserById(jwtPayload.userId);
    //Хешує новий пароль
    const hashedPassword = await passwordService.hashPassword(dto.password);

    //Оновлює пароль в базі даних
    await userRepository.updateUser(user._id, { password: hashedPassword });
    //Видаляє всі токени FORGOT, пов'язані з користувачем
    await actionTokenRepository.deleteByParams({
      tokenType: ActionTokenTypeEnum.FORGOT,
    });
    //Видаляє всі токени доступу, пов'язані з користувачем
    await tokenRepository.deleteByParams({ _userId: user._id });
  }

  public async verify(jwtPayload: IJWTPayload): Promise<IUser> {
    const [user] = await Promise.all([
      //Оновлює статус верифікації користувача
      userRepository.updateUser(jwtPayload.userId, {
        isVerified: true,
      }),
      //Видаляє всі токени дії типу VERIFY
      actionTokenRepository.deleteByParams({
        tokenType: ActionTokenTypeEnum.VERIFY,
      }),
    ]);
    //Повертає оновленого користувача
    return user;
  }

  public async changePassword(
    jwtPayload: IJWTPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const user = await userRepository.getUserById(jwtPayload.userId);
    const isCompare = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isCompare) {
      throw new ApiError("Wrong old password", statusCodes.UNAUTHORIZED);
    }
    const newHashedPassword = await passwordService.hashPassword(
      dto.newPassword,
    );
    await userRepository.updateUser(user._id, { password: newHashedPassword });
    await tokenRepository.deleteByParams({ _userId: user._id });
  }

  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("email already exist", 409);
    }
  }
}

export const authService = new AuthService();
