// Імпорт інтерфейсу IUser, який описує структуру об'єкта користувача.
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

// Визначення класу UserRepository, який містить методи для роботи з користувачами.
class UserRepository {
  // Метод для отримання масиву користувачів.
  public async getAllUsers(): Promise<IUser[]> {
    return await User.find({ isDeleted: false }); // Знайти всіх користувачів у базі даних.
  }

  // Метод для створення нового користувача. Приймає dto (Data Transfer Object), який містить часткові дані користувача.
  public async createUser(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }
  // Метод для отримання користувача за ID.
  public async getUserById(userId: string): Promise<IUser> {
    return await User.findById(userId);
  }
  // Метод для отримання користувача за параметрами. Приймає об'єкт з параметрами, які потрібно знайти.
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }

  // Метод для оновлення даних користувача за ID. Оновлює ім'я, email, і пароль.
  public async updateUser(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  // Метод для видалення користувача за ID.
  public async deleteUser(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}

// Експортуємо екземпляр UserRepository для використання в інших частинах програми.
export const userRepository = new UserRepository();
