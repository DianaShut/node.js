// Імпорт інтерфейсу IUser, який описує структуру об'єкта користувача.
import { IUser } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
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

  // Метод для пошуку користувачів, які не мають активності після вказаної дати.
  //Агрегація - це процес збирання та обробки даних з метою отримання зведеної інформації. В контексті баз даних, агрегація означає виконання операцій, які зводять дані до узагальненого результату, наприклад, обчислення середніх значень, сум, кількостей тощо. В MongoDB агрегація використовується для обробки даних з однієї або декількох колекцій та повернення результату.
  public async findWithOutActivityAfter(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          // Операція $lookup дозволяє зберігати зв'язані дані з іншої колекції в межах одного документа.
          from: Token.collection.name, // Вказуємо колекцію, з якою ми хочемо зробити з'єднання.
          let: { userId: "$_id" }, // Вказуємо змінну, яку будемо використовувати для порівняння. userId, отриманий з поля _id користувача
          pipeline: [
            //Масив стадій, які виконуються на колекції Token
            //$match виконує фільтрацію
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } }, //Порівнює поле _userId в колекції Token зі змінною userId, отриманою з користувача.
            { $match: { createdAt: { $gt: date } } }, //Фільтрує токени, створені після вказаної дати.
          ],
          as: "tokens", //Ім'я масиву, який буде зберігати приєднані токени
        },
      },
      {
        $match: { tokens: { $size: 0 } }, //Фільтрує користувачів, у яких масив tokens порожній (тобто, не було жодної активності після вказаної дати)
      },
      {
        // Виконує проекцію полів, тобто вибирає лише необхідні поля для вихідного результату.
        $project: {
          _id: 1,
          email: 1,
          name: 1,
        },
      },
    ]);
  }
}

// Експортуємо екземпляр UserRepository для використання в інших частинах програми.
export const userRepository = new UserRepository();
