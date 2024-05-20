import { UploadedFile } from "express-fileupload";

import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";
import { smsPrepareService } from "./sms-prepare.service";

class UserService {
  public async getAllUsers(): Promise<IUser[]> {
    return await userRepository.getAllUsers();
  }

  public async getUserById(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId); // Якщо користувач не знайдений, викидаємо помилку.
  }
  public async getMe(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId);
  }
  public async updateMe(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.findUserOrThrow(userId);
    return await userRepository.updateUser(userId, dto);
  }

  public async deleteMe(userId: string): Promise<void> {
    const user = await this.findUserOrThrow(userId);
    await userRepository.updateUser(userId, { isDeleted: true });

    await smsPrepareService.deleteAccount(user.phone, { name: user.name });
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile,
  ): Promise<IUser> {
    const user = await this.findUserOrThrow(userId);
    const filePath = await s3Service.uploadFile(
      avatar,
      FileItemTypeEnum.USER,
      user._id,
    ); // Завантажуємо файл на сервер і отримуємо посилання на файл від сервера AWS S3
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.updateUser(userId, { avatar: filePath }); // Оновлюємо дані користувача в базі даних
  }

  public async deleteAvatar(userId: string): Promise<IUser> {
    const user = await this.findUserOrThrow(userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return await userRepository.updateUser(userId, { avatar: null });
  }

  private async findUserOrThrow(userId: string): Promise<IUser> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }
}

export const userService = new UserService();
