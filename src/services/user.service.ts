import { ApiError } from "../api-error";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../user.interface";

class UserService {
  public async getAllUsers(): Promise<IUser[]> {
    return await userRepository.getAllUsers();
  }

  public async createUser(dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.createUser(dto);
  }

  public async getUserById(userId: number): Promise<IUser> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return user;
  }

  public async updateUser(userId: number, dto: Partial<IUser>): Promise<IUser> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.updateUser(userId, dto);
  }

  public async deleteById(userId: number): Promise<void> {
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new ApiError("user not found", 404);
    }
    return await userRepository.deleteUser(userId);
  }
}

export const userService = new UserService();
