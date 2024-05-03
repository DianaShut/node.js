import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAllUsers(): Promise<IUser[]> {
    return await userRepository.getAllUsers();
  }

  public async createUser(dto: Partial<IUser>): Promise<IUser> {
    await this.isEmailExist(dto.email); // Перевіряємо, чи існує користувач з таким email.
    return await userRepository.createUser(dto);
  }

  public async getUserById(userId: string): Promise<IUser> {
    return await this.findUserOrThrow(userId); // Якщо користувач не знайдений, викидаємо помилку.
  }
  public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.findUserOrThrow(userId);
    return await userRepository.updateUser(userId, dto);
  }

  public async deleteById(userId: string): Promise<void> {
    await this.findUserOrThrow(userId);
    await userRepository.deleteUser(userId);
  }
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("email already exist", 409);
    }
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
