import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

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
    await this.findUserOrThrow(userId);
    await userRepository.deleteUser(userId);
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
